import { Progress } from "antd";
import { useEffect, useState } from "react";
import { axiosInstance } from "../../common/apis";
// 렌더링 시 최적화 하는것은 추후 작업
const ChunkFileUpload = () => {
  // 업로드할 파일들을 담을 State!
  // 허용가능한 확장자 목록!
  // const ALLOW_FILE_EXTENSION = "csv,txt,jpg,jpeg,zip,png,xlsx";
  // const FILE_SIZE_MAX_LIMIT = 150 * 1024 * 1024; // 150MB
  const CHUNK_SIZE = 1024 * 1024 * 5;
  //FileList
  const [files, setFiles] = useState<File[]>([]);
  /*
  chunkCurrentIndex : 현재 청크 파일 인덱스
  currentFileIndex : 현재 업로드 진행중인 파일 인덱스
  totalProgress : 전체 진행률
  progress : 개별 파일 진행률
  stChk: statuscode 200 연속으로 완료가 2번 적용되면  progress 100이라 상태값이 바뀌지않아 progress 가 안바뀜 (chunk 파일 크기보다 작은파일두개를 업로드 했을때)
  */
  const [chunkCurrentIndex, setChunkCurrentIndex] = useState<number | null>(null);
  const [currentFileIndex, setCurrentFileIndex] = useState<number | null>(null);
  const [totalProgress, setTotalProgress] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const [stChk,setStChk] = useState<boolean>(true);
  
  //파일 업로드 변경
  const fileChangeHandle =
    (e: React.ChangeEvent<HTMLInputElement>) => {
      //초기화
      resetState();
      const target = e.currentTarget;
      const fileArr = target.files;
      setFiles([...(fileArr as any)]);
      if (fileArr?.length === 0) {
        return;
      }
    }
    
  //상태 초기화
  const resetState = () =>{
    setFiles([...[]]);
    setChunkCurrentIndex(null);
    setCurrentFileIndex(null)
    setProgress(0);
  }

  const fileUpload = () => {
    if (
      files === undefined ||
      files.length === 0 ||
      currentFileIndex === null ||
      chunkCurrentIndex === null
    ) {
      return;
    }
    const file = files[currentFileIndex];
    if (!file) {
      return;
    }
    // 파일 [...........................] -> [ start......end(start).......end], 
    const start = chunkCurrentIndex * CHUNK_SIZE;
    const end = start + CHUNK_SIZE;
    const chunk: Blob = file.slice(start, end);
    //청크 넘김
    readFileCurrentChunk(chunk);
  }

  const readFileCurrentChunk = async (chunk: Blob) => {
    if (
      files === undefined ||
      currentFileIndex === null ||
      chunkCurrentIndex === null
    ) {
      return;
    }

    const totalChunks = Math.ceil(files[currentFileIndex].size / CHUNK_SIZE);
      
    //스프링에서는 multipart formdata 로 보내고 노드는 octet-stream 형태로 content type 해서 보낼것임 노드에서도 formdata 형식으로 받고싶으면 multer사용
    //스프링 formdata
    const formData = new FormData();
    formData.append("chunk", chunk, files?.[currentFileIndex].name);
    formData.append("chunkNumber", chunkCurrentIndex.toString());//0
    formData.append("totalChunks",totalChunks.toString());//1

    const resp = await axiosInstance.post<ApiResponse<FileItem>>(
      "/chunk/upload/fileList",
      formData,
      { headers: { "content-type": "multipart/form-data" } }
    );
    
    // 노드 octet- stream
    // const params = new URLSearchParams();
    // params.set('name', files[currentFileIndex].name);
    // params.set('size', files[currentFileIndex].size.toString());
    // params.set('chunkNumber', chunkCurrentIndex.toString());
    // params.set('totalChunks', totalChunks.toString());
    // const resp = await nodeAxionInstance.post<ApiResponse<FileItem>>(
    //   "/chunk/upload/fileList?"+params,
    //   chunk,
    //   { headers: { "content-type": "application/octet-stream" } }
    // )
    
    if (resp.status === 206) {
      setChunkCurrentIndex(chunkCurrentIndex +1);
      let progressNum =(chunkCurrentIndex / totalChunks) *100;
      setProgress(progressNum)
    } else if (resp.status === 200) {
      setCurrentFileIndex(currentFileIndex + 1);
      setProgress(100);
      setStChk(!stChk);
    } else {
      console.log("Error Occurred:", resp.statusText);
    }
  };

 //파일 onchanger 될때
  useEffect(() => {
    if (files.length > 0 ) {
      setCurrentFileIndex(
        currentFileIndex === null ? 0 : currentFileIndex + 1
      );
    }
  }, [files.length]);

  //currentFileIndex 현재 파일의 순서 변할떄
  useEffect(() => {
    if (currentFileIndex !== null) {
      setChunkCurrentIndex(0);
    }
    if(currentFileIndex === files.length ){
      resetState();
    }
    if (chunkCurrentIndex === 0) {
      fileUpload();
    }
  }, [currentFileIndex]);

  useEffect(() => {
    if (chunkCurrentIndex !== null) {
      fileUpload();
    }
  }, [chunkCurrentIndex]);

  //개별 파일 progress , 통합 progress
  useEffect(()=>{

    if(currentFileIndex===null){
      return;
    }
    if(currentFileIndex === files.length ){
      setProgress(100)
    }
    setTotalProgress((currentFileIndex/files.length)*100);
  },[progress,stChk])

  return (
    <div>
      <h1>파일 업로드</h1>
      <input type="file" multiple onChange={fileChangeHandle} />
      <Progress percent={Math.round(progress)} status="active" strokeColor={{ from: '#108ee9', to: '#87d068' }} /> 
      <Progress percent={Math.round(totalProgress)} status="active" strokeColor={{ from: '#108ee9', to: '#87d068' }} />
    </div>
  );
};

export default ChunkFileUpload;
