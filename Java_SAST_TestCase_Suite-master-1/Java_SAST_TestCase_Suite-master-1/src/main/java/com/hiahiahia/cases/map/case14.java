package com.hiahiahia.cases.map;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/case14")
public class case14 {
	
	@RequestMapping("/map")
	public void testmap(Map<String, String> map) {
		/*
		 * Map支持, entrySet方法
		 */
		for (String key : map.keySet()) {
		    try {
		        Runtime.getRuntime().exec(map.get(key));   // unsafe
		    } catch (IOException e) {
		        e.printStackTrace();
		    }
		}
	}
}

