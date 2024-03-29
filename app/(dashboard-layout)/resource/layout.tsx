"use client";
import React, { useEffect, useState } from "react";

import MobileSheetSideBar from "@/components/SideBar/MobileSheetSideBar";

import ResourceSideBar from "./components/ResourceSideBar";
import {
  FileLinks,
  QuestionLinks,
  Resource,
  ResourceDislikes,
  ResourceLikes,
  ResourceUser,
  Sheet,
  SheetDislikes,
  SheetLikes,
  SheetUser,
  Task,
  TaskStatus,
  TaskUserStatus,
  User,
  VideoLinks,
  WebsiteLinks,
} from "@prisma/client";
import { pusherClient } from "@/app/libs/pusher";
import { useSession } from "next-auth/react";

export type FullSheetType = Sheet & {
  author: User;
  users: (SheetUser & {
    user: User;
  })[];
  dislikes: SheetDislikes[];
  likes: SheetLikes[];
};

export type FullResourceType = Resource & {
  author: User;
  users: (ResourceUser & {
    user: User;
  })[];
  dislikes: ResourceDislikes[];
  likes: ResourceLikes[];
  tasks: FullResourceTaskType[];
};

export type FullResourceTaskType = Task & {
  questionLinks: QuestionLinks[];
  fileLinks: FileLinks[];
  imageLinks: FileLinks[];
  videoLinks: VideoLinks[];
  websiteLinks: WebsiteLinks[];
  taskStatus: TaskUserStatus[];
};

const SheetLayout = ({ children }: { children: React.ReactNode }) => {
  const [ownSheets, setOwnSheets] = useState<FullSheetType[]>([]);
  const [ownResources, setOwnResources] = useState<FullResourceType[]>([]);
  const [userResources, setUserResources] = useState<FullResourceType[]>([]);
  const [userSheets, setUserSheets] = useState<FullSheetType[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const session = useSession();
  const email = session.data?.user?.email;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ownsheets = await fetch("/api/sheets/ownSheets").then((res) =>
          res.json()
        );
        const ownresources = await fetch("/api/resources/ownResources").then(
          (res) => res.json()
        );
        const userSheets = await fetch("/api/sheets/userSheets").then((res) =>
          res.json()
        );
        const userResources = await fetch("/api/resources/userResources").then(
          (res) => res.json()
        );
        const currentUsers = await fetch("/api/user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }).then((res) => res.json());
        setCurrentUser(currentUsers);

        setUserSheets(userSheets);
        setUserResources(userResources);

        setOwnSheets(ownsheets);
        setOwnResources(ownresources);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    if (email) {
      fetchData();
    }
    return () => {
      setOwnSheets([]);
      setOwnResources([]);
    };
  }, [email]);
  useEffect(() => {
    pusherClient.subscribe("sheet");
    pusherClient.bind("create:sheet", (data: FullSheetType) => {
      if (currentUser?.id === data.authorId) {
        setOwnSheets((prev) => [...prev, data]);
      } else {
        setUserSheets((prev) => [...prev, data]);
      }
    });
    pusherClient.bind("user:sheet", (data: FullSheetType) => {
      setUserSheets((prev) => {
        const index = prev.findIndex((sheet) => sheet.id === data.id);
        if (index === -1) {
          return [...prev, data];
        } else {
          return [...prev];
        }
      });
    });

    pusherClient.bind("delete:sheet", (data: number) => {
      setOwnSheets((prev) => prev.filter((sheet) => sheet.id !== data));
      setUserSheets((prev) => prev.filter((sheet) => sheet.id !== data));
    });
    return () => {
      pusherClient.unsubscribe("sheet");
      pusherClient.unbind("create:sheet");
      pusherClient.unbind("delete:sheet");
      pusherClient.unbind("user:sheet");
    };
  }, [currentUser, ownSheets, userSheets]);

  useEffect(() => {
    pusherClient.subscribe("resource");
    pusherClient.bind("create:resource", (data: FullResourceType) => {
      if (currentUser?.id === data.authorId) {
        setOwnResources((prev) => [...prev, data]);
      } else {
        setUserResources((prev) => [...prev, data]);
      }
    });
    pusherClient.bind("delete:resource", (data: number) => {
      setOwnResources((prev) =>
        prev.filter((resource) => resource.id !== data)
      );
      setUserResources((prev) =>
        prev.filter((resource) => resource.id !== data)
      );
    });
    return () => {
      pusherClient.unsubscribe("resource");
      pusherClient.unbind("create:resource");
      pusherClient.unbind("delete:resource");
    };
  }, [ownSheets, ownResources, currentUser]);

  return (
    <div className="flex lg:flex-row w-full items-start h-full xs:flex-col  ">
      <MobileSheetSideBar
        ownSheets={ownSheets}
        ownResources={ownResources}
        userResources={userResources}
        userSheets={userSheets}
      />
      <ResourceSideBar
        ownResources={ownResources}
        userResources={userResources}
      />

      {children}
    </div>
  );
};

export default SheetLayout;
