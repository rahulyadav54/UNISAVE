package com.unisave.unisave_app

import android.content.ContentValues
import android.media.MediaScannerConnection
import android.net.Uri
import android.os.Build
import android.os.Environment
import android.provider.MediaStore
import io.flutter.embedding.android.FlutterActivity
import io.flutter.embedding.engine.FlutterEngine
import io.flutter.plugin.common.MethodChannel
import java.io.File
import java.io.FileInputStream

class MainActivity : FlutterActivity() {
    private val CHANNEL = "com.unisave.unisave_app/gallery"

    override fun configureFlutterEngine(flutterEngine: FlutterEngine) {
        super.configureFlutterEngine(flutterEngine)
        MethodChannel(flutterEngine.dartExecutor.binaryMessenger, CHANNEL).setMethodCallHandler { call, result ->
            if (call.method == "saveToGallery") {
                val filePath = call.argument<String>("filePath")
                val isVideo = call.argument<Boolean>("isVideo") ?: true
                if (filePath != null) {
                    try {
                        val savedPath = saveMediaToGallery(filePath, isVideo)
                        result.success(savedPath)
                    } catch (e: Exception) {
                        result.error("SAVE_FAILED", e.message, null)
                    }
                } else {
                    result.error("INVALID_PATH", "File path is null", null)
                }
            } else {
                result.notImplemented()
            }
        }
    }

    private fun saveMediaToGallery(sourcePath: String, isVideo: Boolean): String {
        val srcFile = File(sourcePath)
        if (!srcFile.exists()) throw Exception("Source file does not exist")

        val filename = srcFile.name
        val mimeType = if (isVideo) "video/mp4" else "audio/mp4"

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            val collection = if (isVideo) {
                MediaStore.Video.Media.getContentUri(MediaStore.VOLUME_EXTERNAL_PRIMARY)
            } else {
                MediaStore.Audio.Media.getContentUri(MediaStore.VOLUME_EXTERNAL_PRIMARY)
            }

            val relativePath = if (isVideo) {
                "${Environment.DIRECTORY_MOVIES}/UNISAVE"
            } else {
                "${Environment.DIRECTORY_MUSIC}/UNISAVE"
            }

            val values = ContentValues().apply {
                put(MediaStore.MediaColumns.DISPLAY_NAME, filename)
                put(MediaStore.MediaColumns.MIME_TYPE, mimeType)
                put(MediaStore.MediaColumns.RELATIVE_PATH, relativePath)
                put(MediaStore.MediaColumns.IS_PENDING, 1)
            }

            val uri = contentResolver.insert(collection, values)
                ?: throw Exception("Failed to create MediaStore entry")

            contentResolver.openOutputStream(uri)?.use { out ->
                FileInputStream(srcFile).use { input ->
                    input.copyTo(out)
                }
            }

            values.clear()
            values.put(MediaStore.MediaColumns.IS_PENDING, 0)
            contentResolver.update(uri, values, null, null)

            // Trigger MediaScanner for instant gallery indexing
            MediaScannerConnection.scanFile(this, arrayOf(srcFile.absolutePath), arrayOf(mimeType), null)
            return uri.toString()
        } else {
            val targetDir = File(
                Environment.getExternalStoragePublicDirectory(
                    if (isVideo) Environment.DIRECTORY_MOVIES else Environment.DIRECTORY_MUSIC
                ),
                "UNISAVE"
            )
            if (!targetDir.exists()) targetDir.mkdirs()
            val destFile = File(targetDir, filename)
            srcFile.copyTo(destFile, overwrite = true)
            MediaScannerConnection.scanFile(this, arrayOf(destFile.absolutePath), arrayOf(mimeType), null)
            return destFile.absolutePath
        }
    }
}
