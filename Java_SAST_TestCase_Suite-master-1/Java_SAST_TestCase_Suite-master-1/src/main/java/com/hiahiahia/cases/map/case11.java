package com.hiahiahia.cases.map;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/case11")
public class case11 {
	
	@RequestMapping("/map")
	public void testmap(Map<String, String> map) {
		/*
		 * Map支持, entrySet方法
		 */
		for (String value : map.values()) {
		    try {
		        Runtime.getRuntime().exec(value);  // unsafe
		    } catch (IOException e) {
		        e.printStackTrace();
		    }
		}
	}
}
