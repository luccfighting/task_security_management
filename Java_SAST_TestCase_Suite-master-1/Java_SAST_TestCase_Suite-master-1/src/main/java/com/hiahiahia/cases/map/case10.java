package com.hiahiahia.cases.map;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.Iterator;
import java.util.Map;

@RestController
@RequestMapping("/case10")
public class case10 {
	
	@RequestMapping("/map")
	public void testmap(Map<String, String> map) throws IOException {
		/*
		 * Map支持, entrySet方法
		 */
		for (Iterator<Map.Entry<String, String>> iterator = map.entrySet().iterator(); iterator.hasNext();) {
		    Map.Entry<String, String> entry = iterator.next();
		    Runtime.getRuntime().exec(entry.getValue());  // unsafe
		}
	}
}
