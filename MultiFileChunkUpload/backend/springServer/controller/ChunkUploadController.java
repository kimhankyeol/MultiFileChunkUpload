package com.example.demo.controller;

import java.io.IOException;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.demo.service.ChunkUploadService;

import lombok.extern.slf4j.Slf4j;
@Slf4j
@RestController
@CrossOrigin
public class ChunkUploadController {
    private final ChunkUploadService chunkUploadService;

    public ChunkUploadController(ChunkUploadService chunkUploadService){
        this.chunkUploadService = chunkUploadService;
    }
        
    // @ResponseBody
    // @PostMapping("/chunk/upload")
    // public ResponseEntity<String> chunkUpload(@RequestParam("chunk") MultipartFile file,
    //                                           @RequestParam("chunkNumber") int chunkNumber,
    //                                           @RequestParam("totalChunks") int totalChunks) throws IOException {
    //     log.info("chunkNumber:"+chunkNumber+",  ,,,totalChunks: "+totalChunks);
    //     log.info(file.getOriginalFilename());
    //     boolean isDone = chunkUploadService.chunkUpload(file, chunkNumber, totalChunks);
    //     log.info("isdone:"+isDone);

    //     return isDone ?
    //             ResponseEntity.ok("File uploaded successfully") :
    //             ResponseEntity.status(HttpStatus.PARTIAL_CONTENT).build();
    //     // return  ResponseEntity.ok("File uploaded successfully");
    // }
    @ResponseBody
    @PostMapping("/chunk/upload/fileList")
    public ResponseEntity<String> chunkUploadFileList(@RequestParam("chunk") MultipartFile file,
                                              @RequestParam("chunkNumber") int chunkNumber,
                                              @RequestParam("totalChunks") int totalChunks) throws IOException {
        log.info("chunkNumber:"+chunkNumber+",  ,,,totalChunks: "+totalChunks);
        log.info(file.getOriginalFilename());
        boolean isDone = chunkUploadService.chunkUpload(file, chunkNumber, totalChunks);

        return isDone ?
                ResponseEntity.ok("File uploaded successfully") :
                ResponseEntity.status(HttpStatus.PARTIAL_CONTENT).build();
    }
}
