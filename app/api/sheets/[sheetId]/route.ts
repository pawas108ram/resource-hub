import { getCurrentUser } from "@/app/_actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";
import { pusherServer } from "@/app/libs/pusher";

import { NextResponse } from "next/server";
interface IParams {
  sheetId?: string;
}

export async function DELETE(req: Request, { params }: { params: IParams }) {
  try {
    const currentUser = await getCurrentUser();
    const { sheetId } = params;

    if (!sheetId) {
      return new NextResponse("Missing sheetId", { status: 400 });
    }
    if (!currentUser || !currentUser.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const sheet = await prisma.sheet.findFirst({
      where: {
        id: parseInt(sheetId),
        authorId: currentUser.id,
      },
    });
    const sheetUser = await prisma.sheetUser.findFirst({
      where: {
        userId: currentUser.id,
        sheetId: parseInt(sheetId),
      },
    });
    if (!sheet && !sheetUser) {
      return new NextResponse("Sheet not found", { status: 404 });
    }
    if (sheet) {
      const deleteUsers = await prisma.sheetUser.deleteMany({
        where: {
          sheetId: parseInt(sheetId),
        },
      });

      const deletedSheet = await prisma.sheet.delete({
        where: {
          id: parseInt(sheetId),
        },
      });
        await pusherServer.trigger('sheet','delete:sheet',deletedSheet.id)
     
      if (!deleteUsers || !deletedSheet) {
        return new NextResponse("Sheet could not be deleted propely", {
          status: 400,
        });
      }

      return NextResponse.json(deletedSheet, { status: 200 });
    }
    if (sheetUser) {
      const userDelete = await prisma.sheetUser.delete({
        where: {
          id: sheetUser.id,
          userId: currentUser.id,
          sheetId: parseInt(sheetId),
        },
      });
      if (!userDelete) {
        return new NextResponse("User could not be deleted properly", {
          status: 400,
        });
      }

      return NextResponse.json(userDelete, { status: 200 });
    }
  } catch (error) {
    console.log("Sheet Deletion Error: ", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function GET(req: Request, { params }: { params: IParams }) {
  try {
    const { sheetId } = params;
    const { searchParams } = new URL(req.url);
    console.log(searchParams);
    const updatedAt = searchParams.has("updatedAt")
      ? searchParams.get("updatedAt")
      : null;
    const createdAt = searchParams.has("createdAt")
      ? searchParams.get("createdAt")
      : null;
    const likes = searchParams.has("likes") ? searchParams.get("likes") : null;
    const solutions = searchParams.has("solutions")
      ? searchParams.get("solutions")
      : null;

    const currentUser = await getCurrentUser();

    if (!sheetId) {
      return new NextResponse("Missing sheetId", { status: 400 });
    }
    if (!currentUser || !currentUser.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const sheet = await prisma.sheet.findUnique({
      where: {
        id: parseInt(sheetId),
        OR: [
          {
            authorId: currentUser.id,
          },
          {
            users: {
              some: {
                userId: currentUser.id,
              },
            },
          },
        ],
      },

      include: {
        author: true,
        questions: {
          where: {
            folderId: null,
          },
          orderBy: {
            ...(createdAt && {
              createdAt: createdAt === "ASC" ? "asc" : "desc",
            }),
            ...(updatedAt && {
              updatedAt: updatedAt === "ASC" ? "asc" : "desc",
            }),
            ...(likes && {
              likes: {
                _count: likes as "asc" | "desc",
              },
            }),
            ...(solutions && {
              solutions: {
                _count: solutions as "asc" | "desc",
              },
            }),
          },
          include: {
            likes: true,
            dislikes: true,
            solutions: true,
            questionStatus: {
              where: {
                userId: currentUser.id,
              },

              include: {
                user: true,
              },
            },
          },
        },
        folders: {
          include: {
            questions: {
              where: {
                folderId: {
                  not: null,
                },
              },
              orderBy: {
                ...(createdAt && {
                  createdAt: createdAt === "ASC" ? "asc" : "desc",
                }),
                ...(updatedAt && {
                  updatedAt: updatedAt === "ASC" ? "asc" : "desc",
                }),
                ...(likes && {
                  likes: {
                    _count: likes as "asc" | "desc",
                  },
                }),
                ...(solutions && {
                  solutions: {
                    _count: solutions as "asc" | "desc",
                  },
                }),
              },
              include: {
                likes: true,
                dislikes: true,
                solutions: true,
                questionStatus: {
                  where: {
                    userId: currentUser.id,
                  },
                  include: {
                    user: true,
                  },
                },
              },
            },
          },
        },
        users: {
          include: {
            user: true,
          },
        },
      },
    });
    
    if (!sheet) {
      return new NextResponse("Unauthorised", { status: 401 });
    }
    return NextResponse.json(sheet, { status: 200 });
  } catch (error) {
    console.log("Sheet Retrieval Error: ", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
