package com.hiahiahia.cases.map;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/case6")
public class case6 {
	
	@RequestMapping("/map")
	public void testmap(Map<String, String> map) throws IOException {
		/*
		 * Map支持, entrySet方法
		 */
		for (String value : map.values()) {
    		Runtime.getRuntime().exec(value); // unsafe
		}
	}
}
