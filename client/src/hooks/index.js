import { useEffect, useState } from "react";
import { fetchBufferUrl, parserText } from "../requests";
export const useGetVideos = (defaultText = "") => {
  const [videos, setVideos] = useState([]);
  const getVideos = async (text = "") => {
    try {
      const addresses = await parserText(text);
      setVideos([...addresses]);
    } catch (e) {
      alert(e.message);
    }
  };
  useEffect(() => {
    defaultText && getVideos(defaultText);
  });
  return [videos, getVideos, setVideos];
};

export const useFetchBufferUrl = (defaultUrl = "") => {
  const [url, setUrl] = useState("");
  const getUrl = async (url = "") => {
    try {
      const bufferUrl = await fetchBufferUrl(url);
      setUrl(bufferUrl);
    } catch (e) {
      alert(e.message);
    }
  };
  useEffect(() => {
    defaultUrl && getUrl(defaultUrl);
  });
  return [url, getUrl, setUrl];
};
