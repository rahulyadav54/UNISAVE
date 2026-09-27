-keep class androidx.work.** { *; }
-keep class androidx.room.** { *; }
-keep class androidx.sqlite.** { *; }
-keep class * extends androidx.room.RoomDatabase
-keep class androidx.core.content.FileProvider { *; }
-keep class com.unisave.unisave_app.** { *; }
-keepattributes *Annotation*
-dontwarn java.lang.invoke.**

