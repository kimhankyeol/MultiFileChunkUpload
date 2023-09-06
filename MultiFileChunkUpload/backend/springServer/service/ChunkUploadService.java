package com.example.demo.service;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import lombok.extern.slf4j.Slf4j;


@Slf4j
@Service
public class ChunkUploadService {
    private final static String realFilePath = ""; //직접적인 파일경로
    public boolean chunkUpload(MultipartFile file, int chunkNumber, int totalChunks) throws IOException {
    	// 파일 업로드 위치
        File dir = new File(realFilePath);
        if (!dir.exists()) {
            dir.mkdirs();
        }

		// 임시 저장 파일 이름
        String filename = file.getOriginalFilename() + ".part" + chunkNumber;

        Path filePath = Paths.get(realFilePath, filename);
        // 임시 저장
        Files.write(filePath, file.getBytes());

		// 마지막 조각이 전송 됐을 경우
        if (chunkNumber == totalChunks-1) {
            String[] split = file.getOriginalFilename().split("\\.");
            String outputFilename = UUID.randomUUID() + "." + split[split.length-1];
            Path outputFile = Paths.get(realFilePath, outputFilename);
            Files.createFile(outputFile);
            
            // 임시 파일들을 하나로 합침
            for (int i = 0; i<totalChunks; i++) {
                Path chunkFile = Paths.get(realFilePath, file.getOriginalFilename() + ".part" + i);
                Files.write(outputFile, Files.readAllBytes(chunkFile), StandardOpenOption.APPEND);
                // 합친 후 삭제
                Files.delete(chunkFile);
            }
            log.info("File uploaded successfully");
            return true;
        } else {
            return false;
        }
    }
}