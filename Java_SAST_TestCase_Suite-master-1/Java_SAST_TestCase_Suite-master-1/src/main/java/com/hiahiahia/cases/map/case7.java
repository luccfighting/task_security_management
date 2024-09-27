package com.hiahiahia.cases.map;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/case7")
public class case7 {
	
	@RequestMapping("/map")
	public void testmap(Map<String, String> map) throws IOException {
		/*
		 * Map支持, entrySet方法
		 */
		for (Map.Entry<String, String> entry : map.entrySet()) {
		    Runtime.getRuntime().exec(entry.getValue());  // unsafe
		}
	}
}
