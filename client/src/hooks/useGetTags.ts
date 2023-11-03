import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../axios";
import { Tag } from "@prisma/client";
import { QUERY_KEYS } from "../constants";

export type TagOption = Pick<Tag, "name"> & {
  inputValue?: string;
};

const getTags = async () => {
  const { data } = await axiosInstance.get<TagOption[]>("/tags");

  return data;
};

export const useGetTags = () => {
  return useQuery({
    queryFn: getTags,
    queryKey: QUERY_KEYS.GET_TAGS,
  });
};
