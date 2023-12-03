import { difficulties } from "@/app/libs/const/difficulty";
import { topics } from "@/app/libs/const/questionTag";
import Heading from "@/components/Heading";
import { FilterOptions, FilterType } from "@/components/modals/FilterSolutionModal";

import { Difficulty, QuestionTag } from "@prisma/client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { MdClose } from "react-icons/md";
import Select from 'react-select';


const SheetQuestionFilter = ({ onClose,setTags,setDifficulty ,sheetId}: { onClose: () => void ,setTags:React.Dispatch<React.SetStateAction<{value:QuestionTag,label:string}[] | null>>,setDifficulty:React.Dispatch<React.SetStateAction<{value:Difficulty,label:string} | null>> ,sheetId:string}) => {
    const [difficulty, selectDifficulty] = useState<{value:Difficulty,label:string}| null>(null);
    const [tags, selectTags] = useState<{ value: QuestionTag, label: string }[] | null>(null);
    const [updatedAt, setUpdatedAt] = useState<{ value: FilterType, label: string } | null>(null);
    const [createdAt, setCreatedAt] = useState<{ value: FilterType, label: string } | null>(null);
    const [likes, setLikes] = useState<{ value: FilterType, label: string } | null>(null);
    const [solutions, setSolutions] = useState<{ value: FilterType, label: string } | null>(null);
    const router = useRouter();
    const handleFilters = () => {
      let url = `/sheet/${sheetId}`;
      if (updatedAt) {
        url += `?updatedAt=${updatedAt.value}`;
      }
      if(createdAt){
        url += `&createdAt=${createdAt.value}`;
      }
      if (likes) {
        url += `&likes=${likes.value}`;
        }
        if (solutions) {
            url += `&solutions=${solutions.value}`;
        }
        
        setDifficulty(difficulty);
        setTags(tags);
      router.push(url);
      onClose();
      
    }
    return (
      <div className='bg-black/30 inset-0 fixed z-[999] flex flex-row items-center justify-center  '>
      <div className='p-8 bg-black max-w-lg w-full xs:w-4/5 rounded h-auto shadow relative flex flex-col gap-4  '>
          <button className='p-4 bg-red-500 rounded-full absolute -top-5 -right-5 ' onClick={onClose}><MdClose /></button>
          <Heading body='Filter Questions' className="text-white " />
          <div className="grid grid-cols-2 gap-2 w-full bg-white/80 p-2 rounded  ">
            <div className="flex flex-col gap-1">
              <span>Filter By Difficulty</span>
              <Select options={difficulties} value={difficulty}  onChange={(e:any)=>selectDifficulty(e)} maxMenuHeight={150} isClearable />
            </div>
            <div className="flex flex-col gap-1">
              <span>Filter By Tags</span>
              <Select options={topics} value={tags} onChange={(e:any)=>selectTags(e)} maxMenuHeight={150} isClearable isMulti/>
            </div>
            <div className="flex flex-col gap-1">
              <span>Filter By Updated At</span>
              <Select options={FilterOptions} value={updatedAt} onChange={(e:any)=>setUpdatedAt(e)} maxMenuHeight={150} isClearable/>
            </div>
            <div className="flex flex-col gap-1">
              <span>Filter By Created At</span>
              <Select options={FilterOptions} value={createdAt} onChange={(e: any) => setCreatedAt(e)} maxMenuHeight={150} isClearable/>
            </div>
            <div className="flex flex-col gap-1">
              <span>Filter By Likes</span>
              <Select options={FilterOptions} value={likes} onChange={(e: any) => setLikes(e)} maxMenuHeight={150} isClearable/>
            </div>
            <div className="flex flex-col gap-1">
              <span>Filter By Solutions</span>
              <Select options={FilterOptions} value={solutions} onChange={(e: any) => setSolutions(e)} maxMenuHeight={150} isClearable />
              </div>
          </div>
          <button className="bg-blue-500 py-2 px-4 self-center rounded text-white  font-semibold" onClick={()=>handleFilters()}>Apply Filters</button>
          

       
          

          
      </div>
  
</div>

    )
}
  
export default SheetQuestionFilter