package com.resultmanagement.util;

public class GradeUtil {

    private GradeUtil() {
    }

    /**
     * Returns the grade point for a given total mark (out of 100)
     * based on the standard grading scale:
     * 90+   -> 10
     * 80-89 -> 9
     * 70-79 -> 8
     * 60-69 -> 7
     * 50-59 -> 6
     * <50   -> 0
     */
    public static int getGradePoint(double totalMarks) {
        if (totalMarks >= 90) return 10;
        if (totalMarks >= 80) return 9;
        if (totalMarks >= 70) return 8;
        if (totalMarks >= 60) return 7;
        if (totalMarks >= 50) return 6;
        return 0;
    }
}
