import axios, { AxiosError, AxiosResponse } from 'axios';
//스프링 전용 axios
export const axiosInstance = axios.create({
    baseURL :"http://localhost:8001/",
    // headers: {
    //     "Content-Type": `application/json;charset=UTF-8`,
    //     "Accept": "application/json",
    //     // "Authorization": "Bearer "+token,
    //     "Access-Control-Allow-Origin": `http://localhost:3000`,
    //     'Access-Control-Allow-Credentials':"true",
    // }
})

//노드 전용 axios
export const nodeAxionInstance = axios.create({
    baseURL:"http://localhost:3001",
})
//응답 데이터 
const responseBody = <T>(resp:AxiosResponse<ApiResponse<T>>):ApiResponse<T> => {
    const data:ApiResponse<T> = resp.data;
    //스프링에서 이 형식에 맞게 상태코드와 데이터를 같이 넘겨주면 확인가능
    // console.table(resp);
    // console.log(data.resultCode);
    // console.log(data.respTime);
    // console.log(data.resultData);
    // data.httpStatus = response?.status;
    // data.httpStatusText = response?.statusText;
    return data;
};

//성공시 반환
const successCallback = <T>(resp:AxiosResponse<ApiResponse<T>>):ApiResponse<T> => {
    return responseBody(resp);
};

//에러시
const errCallback = <T>(errResp:AxiosError<ApiResponse<T>>):ApiResponse<T> => {
    // ErrorCallBack 공통 처리 항목 있을 경우 사용
    console.error(errResp.response)

    return responseBody(errResp.response as AxiosResponse<ApiResponse<T>, any>);
};

export const METHOD_REQUEST = {
     // ReqT : RequestType, RespT : ResponseType
  get:<ReqT, RespT>(endpoint:string, parameters?:ReqT):Promise<ApiResponse<RespT>> => axiosInstance.get(endpoint, { params : parameters }).then(res => successCallback<RespT>(res)).catch((error) => {throw errCallback<RespT>(error);}),
  post:<ReqT, RespT>(endpoint:string, parameters?:ReqT, options?:{}):Promise<ApiResponse<RespT>> => axiosInstance.post(endpoint, parameters, options).then((res) => successCallback<RespT>(res)).catch((error) => {throw errCallback<RespT>(error);}),
  patch:<ReqT, RespT>(endpoint:string, parameters?:ReqT):Promise<ApiResponse<RespT>> => axiosInstance.patch(endpoint, parameters).then((res) => successCallback<RespT>(res)).catch((error) => {throw errCallback<RespT>(error);}),
  delete:<ReqT, RespT>(endpoint:string, parameters?:ReqT):Promise<ApiResponse<RespT>> => axiosInstance.delete(endpoint, {params : parameters}).then((res) => successCallback<RespT>(res)).catch((error) => {throw errCallback<RespT>(error);})
}