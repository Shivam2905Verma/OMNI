import { createContext, useState } from "react";
import { processData, saveData } from "./service/omni.api";

export const OmniContext = createContext();

export const OmniProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [data, setData] = useState();
  const [link, setLink] = useState("");
  const [file, setFile] = useState(null);
  const [summary, setSummary] = useState("");
  const [tags, setTags] = useState("");
  const [pillar, setPillar] = useState("");
  const [subTopic, setSubTopic] = useState("");
  const [manualNote, setManualNote] = useState("");
  const [loading, setLoading] = useState("");
  const [filePreview, setFilePreview] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    
    if (!selectedFile) return;
    setFile(selectedFile);
    
    if (selectedFile.type === "text/plain") {
      const reader = new FileReader();

      reader.onload = (event) => {
        setFilePreview(event.target.result);
      };

      reader.readAsText(selectedFile);
    } else {
      const previewURL = URL.createObjectURL(selectedFile);
      setFilePreview(previewURL);
    }
  };

  const handleGenerate = async () => {
    setData(null);
    const formData = new FormData();

    if (file) {
      formData.append("file", file);
    } else {
      console.log(link);
      formData.append("content", link);
    }

    try {
      setLoading(true);
      const res = await processData(formData);
      setSummary(res.summary);
      setPillar(res.pillar);
      setSubTopic(res.subtopic);
      res?.tags.forEach((tag) => {
        setTags((pre) => pre + " " + `, ${tag} `);
      });

      console.log(res);
      setTags(res.tags);
      setData(res);
    } catch (error) {
      console.log("this error come from handleGenerate");
    } finally {
      setLoading(false);
    }
  };

  async function handleSaveData() {
    const formData = new FormData();

    if (file) {
      formData.append("file", file);
    }
    if (link) {
      formData.append("link", link);
    }

    if (manualNote) {
      formData.append("manualNote", manualNote);
    }
    formData.append("pillar", pillar);
    formData.append("subTopic", subTopic);
    formData.append("tags", tags);
    formData.append("summary", summary);

    try {
      setLoading(true);
      const res = await saveData(formData);
      console.log(res);
      setData("");
      setLink("");
      setManualNote("");
      setFile(null);
      setFilePreview(null);
    } catch (error) {
      console.log("this error come from saveData");
    } finally {
      setLoading(false);
    }
  }

  return (
    <OmniContext.Provider
      value={{
        data,
        summary,
        user,
        setUser,
        setSummary,
        tags,
        setTags,
        pillar,
        setPillar,
        subTopic,
        setSubTopic,
        manualNote,
        setManualNote,
        link,
        setLink,
        filePreview,
        setFilePreview,
        file,
        loading,
        setFile,
        handleFileChange,
        handleGenerate,
        handleSaveData,
      }}
    >
      {children}
    </OmniContext.Provider>
  );
};

export default OmniProvider;
