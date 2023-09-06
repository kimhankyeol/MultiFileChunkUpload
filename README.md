# MultiFileChunkUpload
## 파일 분할 업로드
### Front End - React (progress bar는 antd 사용)
### Back End - Spring Boot , Node

## 개요
#### 대용량 파일 업로드시 병목 및 메모리 문제가 일어날수 있음 이것을 작은 파일로 분할하여 나눠서 업로드하는 것으로 구현함

### [Spring]
150mb 파일을 5mb 단위로 분할하여 순차적으로 전송하고 전송이 완료되면 파일을 하나로 합침.

### [Node]
150mb 파일을 5mb 단위로 분할하여 하나의 임시파일을 생성하고 임시파일에 5mb 단위로 append함

#### 파일을 분할하고 인덱스를 이용하여 상태값을 변경하면서 서버와 통신함
#### React axios 통신 -> Spring , Node(express)
#### Spring은 Content-Type multipart/form-data
#### Node는 Content-Type application/octet-stream
#### Node는 multipart/form-data으로 보내려면 Multer를 이용하면됨
React 최적화된 렌더링은 나중에 ....
