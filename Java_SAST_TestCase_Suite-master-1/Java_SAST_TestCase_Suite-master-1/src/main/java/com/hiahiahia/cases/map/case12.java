package com.hiahiahia.cases.map;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/case12")
public class case12 {
	
	@RequestMapping("/map")
	public void testmap(Map<String, String> map) {
		/*
		 * Map支持, entrySet方法
		 */
		for (Map.Entry<String, String> entry : map.entrySet()) {
		    try {
		        Runtime.getRuntime().exec(entry.getValue());  // unsafe
		    } catch (IOException e) {
		        e.printStackTrace();
		    }
		}
	}
}
