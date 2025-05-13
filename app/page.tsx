"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useStore } from "@/store/useStore";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { GoogleGenerativeAI } from "@google/generative-ai";
import type { SafetyViolation } from "@/store/useStore";

const WORKER_MIN = 5;
const WORKER_MAX = 25;
const SAFETY_MIN = 70;
const SAFETY_MAX = 100;
const VIOLATION_PROBABILITY = 0.7;
const ANALYSIS_INTERVAL = 5000;

const genAI = new GoogleGenerativeAI(
  process.env.NEXT_PUBLIC_GEMINI_API_KEY || "",
);

export default function DashboardPage() {
  const { addSafetyViolation } = useStore();
  const [workerCount, setWorkerCount] = useState(0);
  const [safetyCompliance, setSafetyCompliance] = useState(0);

  useEffect(() => {
    const analyzeVideoFeed = async () => {
      try {
        const model = genAI.getGenerativeModel({
          model: "gemini-2.0-flash-lite",
        });
        const prompt = `
          Analyze this construction site video frame and provide:
          1. Number of workers present
          2. Any safety violations (PPE, equipment, etc.)
          3. Overall safety compliance score (0-100)
        `;
        await model.generateContent(prompt);

        // Simulate data for demo purposes
        setWorkerCount(
          Math.floor(Math.random() * (WORKER_MAX - WORKER_MIN)) + WORKER_MIN,
        );
        setSafetyCompliance(
          Math.floor(Math.random() * (SAFETY_MAX - SAFETY_MIN)) + SAFETY_MIN,
        );

        if (Math.random() > VIOLATION_PROBABILITY) {
          const violation: SafetyViolation = {
            id: Date.now().toString(),
            type: "PPE Violation",
            description: "Worker not wearing required safety gear",
            timestamp: new Date().toISOString(),
            severity: "medium",
          };
          addSafetyViolation(violation);
        }
      } catch (error) {
        console.error("Error analyzing video feed:", error);
      }
    };

    const interval = setInterval(analyzeVideoFeed, ANALYSIS_INTERVAL);
    return () => clearInterval(interval);
  }, [addSafetyViolation]);

  return <div className="space-y-6"></div>;
}
