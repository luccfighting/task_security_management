package com.hiahiahia.cases.map;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.Iterator;
import java.util.Map;

@RestController
@RequestMapping("/case15")
public class case15 {
	
	@RequestMapping("/map")
	public void testmap(Map<String, String> map) {
		/*
		 * Map支持, entrySet方法
		 */
		for (Iterator<Map.Entry<String, String>> iterator = map.entrySet().iterator(); iterator.hasNext();) {
		    Map.Entry<String, String> entry = iterator.next();
		    try {
		        Runtime.getRuntime().exec(entry.getValue());  // unsafe
		    } catch (IOException e) {
		        e.printStackTrace();
		    }
		}
	}
}

