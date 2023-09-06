// 응답 T : 제네릭 타입
/*
결과코드
메시지
데이터
응답시간
에러

DTO 맞춰서 
*/
interface ApiResponse<T> {
  resultCode: number;
  mes: string;
  resultData: T;
  respTime: number;
  err?: ErrorInfo; 
}

interface ErrorInfo {
  errCode: string;
  errMes: string;
  alertMes?: string;
}
