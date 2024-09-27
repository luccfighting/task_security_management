package com.hiahiahia.cases.map;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.Iterator;
import java.util.Map;

@RestController
@RequestMapping("/case8")
public class case8 {
	
	@RequestMapping("/map")
	public void testmap(Map<String, String> map) throws IOException {
		/*
		 * Map支持, entrySet方法
		 */
		Iterator<String> iterator = map.values().iterator();
		while (iterator.hasNext()) {
		    Runtime.getRuntime().exec(iterator.next());  // unsafe
		}
	}
}
