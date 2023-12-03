"use client";
import React, { useEffect, useState } from "react";
import ResourceControlBar from "./components/ResourceControlBar";

import toast from "react-hot-toast";
import Heading from "@/components/Heading";
import { MdUpload } from "react-icons/md";
import SubHeading from "@/components/SubHeading";
import Content from "@/components/Content";
import { FullResourceType } from "./layout";
import ResourceCard from "./components/ResourceCard";
import { ResourceTag, User } from "@prisma/client";
import { useSession } from "next-auth/react";
import { GiConsoleController } from "react-icons/gi";
import { useSearchParams } from "next/navigation";
import { pusherClient } from "@/app/libs/pusher";

const ResourcePage = () => {
  const [searchTitle, setSearchTitle] = useState("");
  const [privateResource, setPrivateResource] = useState<FullResourceType[]>(
    []
  );
  const [publicResource, setPublicResource] = useState<FullResourceType[]>([]);
  const [resources, setResources] = useState<FullResourceType[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const session = useSession();
  const email = session.data?.user?.email;
  const searchParams = useSearchParams();
  const searchParamsString = searchParams?.toString();
  const [resourceFilterTags, setResourceFilterTags] = useState<{value:ResourceTag,label:string}[]>([]);
 
  
  

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch(`/api/user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email }),
      });
      if (res.ok) {
        const data = await res.json();
        setCurrentUser(data);
      }
     
    };
    fetchUser();
  }, [email]);

  useEffect(() => {
    const fetchResources = async () => {
      const res = await fetch("/api/resources/allResources/?"+encodeURI(searchParamsString|| ''), );

      if (res.ok) {
        const data = await res.json();
        setResources(data);
        setPrivateResource(
          data.filter((resource: FullResourceType) => !resource.isPublic)
        );
        setPublicResource(
          data.filter((resource: FullResourceType) => resource.isPublic)
        );
      } else {
        const text=await res.text();
        toast.error(text);
      }
    };
    fetchResources();
  }, [searchParamsString]);
  useEffect(() => {
    if (searchTitle === "") {
      setPrivateResource(
        resources.filter((resource: FullResourceType) => !resource.isPublic)
      );
      setPublicResource(
        resources.filter((resource: FullResourceType) => resource.isPublic)
      );
    } else if (searchTitle !== "") {
      setPrivateResource(
        resources.filter(
          (resource: FullResourceType) =>
            !resource.isPublic &&
            resource?.title?.toLowerCase().includes(searchTitle.toLowerCase())
        )
      );
      setPublicResource(
        resources.filter(
          (resource: FullResourceType) =>
            resource.isPublic &&
            resource?.title?.toLowerCase().includes(searchTitle.toLowerCase())
        )
      );
    }
  }, [searchTitle, resources]);

  useEffect(() => {
    if (resources) {
      if (resourceFilterTags.length === 0) {
        setPrivateResource(
          resources.filter((resource: FullResourceType) => !resource.isPublic)
        );
        setPublicResource(
          resources.filter((resource: FullResourceType) => resource.isPublic)
        );
      } else {
        const privateResourceFilter = resources.filter(
          (resource: FullResourceType) =>
            !resource.isPublic &&
            resourceFilterTags.some((filterTag) =>
              resource.tags?.includes(filterTag.value)
            )
        );
        const publicResourceFilter = resources.filter(
          (resource: FullResourceType) =>
            resource.isPublic &&
            resourceFilterTags.some((filterTag) =>
              resource.tags?.includes(filterTag.value)
            )
        );
        setPrivateResource(privateResourceFilter);
        setPublicResource(publicResourceFilter);
      }
    }
    pusherClient.subscribe("resource");
    pusherClient.bind('remove:resource', (data: number) => {
      setPrivateResource((prevUserResources) =>
        prevUserResources.filter((resource) => resource.id !== data)
      );
      setPublicResource((prevUserResources) =>
        prevUserResources.filter((resource) => resource.id !== data)
      );
    });
  },[resourceFilterTags,resources])

  return (
    <div className="flex flex-col gap-3 p-4 h-screen w-full overflow-y-auto bg-black text-white   ">
      <ResourceControlBar title={searchTitle} setTitle={setSearchTitle} resourceFilterTags={resourceFilterTags} setResourceFilterTags={setResourceFilterTags} />
      <Heading body="Public resources" className="whitespace-nowrap" />
      {currentUser && publicResource.length !== 0 ? (
        <div className="p-4 bg-white/10 rounded w-full grid xl:grid-cols-3  lg:gap-x-4  lg:gap-y-4 xs:grid-cols-2 xs:gap-x-2 xs:gap-y-2 lg:grid-cols-3">
          {publicResource.map((resource) => (
            <ResourceCard currentUserId={currentUser.id}  key={resource.id} publicResource={resource} />
          ))}
        </div>
      ) : (
        <span className="text-xl bg-white/60 text-black p-3 rounded text-center font-semibold">
          No Public Resources made yet{" "}
        </span>
      )}
      <Heading body="Private resources" className="whitespace-nowrap" />
      {currentUser && privateResource.length !== 0 ? (
        <div className="p-4 bg-white/10 rounded w-full grid xl:grid-cols-3  lg:gap-x-4  lg:gap-y-4 xs:grid-cols-2 xs:gap-x-2 xs:gap-y-2 lg:grid-cols-3">
          {privateResource.map((resource) => (
            <ResourceCard currentUserId={currentUser.id} key={resource.id} privateResource={resource} currentUserKeys={currentUser.keys} />
          ))}
        </div>
      ) : (
        <span className="text-xl bg-white/60 text-black p-3 rounded text-center font-semibold">
          No Private Resources made yet
        </span>
      )}
    </div>
  );
};

export default ResourcePage;
