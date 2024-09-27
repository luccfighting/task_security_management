package com.hiahiahia.cases.map;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.Iterator;
import java.util.Map;

@RestController
@RequestMapping("/case13")
public class case13 {
	
	@RequestMapping("/map")
	public void testmap(Map<String, String> map) {
		/*
		 * Map支持, entrySet方法
		 */
		Iterator<String> iterator = map.values().iterator();
		while (iterator.hasNext()) {
		    try {
		        Runtime.getRuntime().exec(iterator.next());  // unsafe
		    } catch (IOException e) {
		        e.printStackTrace();
		    }
		}
	}
}

