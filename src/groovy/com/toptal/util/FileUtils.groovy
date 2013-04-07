package com.toptal.util

import java.io.File
import java.util.List

class FileUtils {

	/**
	 * 
	 * @param relativePath
	 * @param logicalRootPath
	 * @return
	 */
	public static List getFileNamesFromDir(String relativePath, String logicalRootPath) {
		return getPathFilesFromDir(new File(relativePath), logicalRootPath)
	}

	/**
	 * @param dir
	 * @param rootPath
	 * @return
	 */
	public static List getPathFilesFromDir(File dir, String rootPath) {

		List res = []


		dir.listFiles().each { File file ->

			if (file.isDirectory()) {
				if (file.name != '.svn') {
					res.addAll(getPathFilesFromDir(file, rootPath))
				}
			} else {
				res.add(getBasePath(file.path, rootPath))
			}
		}
		return res
	}

	/**
	 * 
	 * @param fullPath
	 * @param rootPath
	 * @return
	 */
	public static String getBasePath(String fullPath, String rootPath) {

		fullPath = fullPath.replaceAll("\\\\", "/")
		return fullPath.replaceAll(fullPath.substring(0, fullPath.indexOf(rootPath)), "")
	}
}
