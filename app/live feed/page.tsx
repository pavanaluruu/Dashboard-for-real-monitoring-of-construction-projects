"use client";

import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useStore } from "@/store/useStore";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(
  process.env.NEXT_PUBLIC_GEMINI_API_KEY || "",
);

interface Analysis {
  number_of_workers_visible: number;
  safety_violations: Array<{
    type: string;
    description: string;
    severity: string;
  }>;
  safety_compliance_score: number;
  scene_summary: string;
}

export default function LiveFeedPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const { addSafetyViolation } = useStore();

  useEffect(() => {
    const startWebcam = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Error accessing webcam:", error);
      }
    };

    startWebcam();

    return () => {
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    const analyzeVideoFeed = async () => {
      if (!videoRef.current || isAnalyzing) return;

      try {
        setIsAnalyzing(true);
        const model = genAI.getGenerativeModel({
          model: "gemini-2.0-flash-lite",
        });

        const canvas = document.createElement("canvas");
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          throw new Error("Could not get canvas context");
        }

        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

        const imageData = canvas.toDataURL("image/jpeg");

        const prompt = `You are a construction site safety monitoring AI. Analyze this image and respond with a JSON object in this exact format:
{
  "number_of_workers_visible": <number>,
  "safety_violations": [
    {
      "type": "<violation type>",
      "description": "<detailed description>",
      "severity": "<low/medium/high>"
    }
  ],
  "safety_compliance_score": <number 0-100>,
  "scene_summary": "<brief summary>"
}
Respond ONLY with the JSON object, no other text.`;

        const result = await model.generateContent([
          prompt,
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: imageData.split(",")[1],
            },
          },
        ]);

        const response = result.response.text();

        try {
          const cleanResponse = response
            .trim()
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

          const analysis = JSON.parse(cleanResponse) as Analysis;
          setAnalysis(analysis);

          if (
            analysis.safety_violations &&
            Array.isArray(analysis.safety_violations)
          ) {
            analysis.safety_violations.forEach((violation) => {
              if (
                violation.type &&
                violation.description &&
                violation.severity
              ) {
                addSafetyViolation({
                  id: Date.now().toString(),
                  type: violation.type,
                  description: violation.description,
                  timestamp: new Date().toISOString(),
                  severity: violation.severity.toLowerCase() as
                    | "low"
                    | "medium"
                    | "high",
                });
              }
            });
          }
        } catch (parseError) {
          console.error("Error parsing analysis response:", parseError);
          console.error("Raw response:", response);
        }
      } catch (error) {
        console.error("Error analyzing video feed:", error);
      } finally {
        setIsAnalyzing(false);
      }
    };

    const interval = setInterval(analyzeVideoFeed, 5000); // Analyze every 5 seconds
    return () => clearInterval(interval);
  }, [addSafetyViolation]);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Live Video Feed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
              <video
                ref={videoRef}
                className="w-full h-full object-cover rounded-lg"
                autoPlay
                muted
                playsInline
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Real-time Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analysis && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="font-semibold">Workers Present</p>
                      <p className="text-2xl font-bold">
                        {analysis.number_of_workers_visible}
                      </p>
                    </div>
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="font-semibold">Safety Score</p>
                      <p className="text-2xl font-bold">
                        {analysis.safety_compliance_score}%
                      </p>
                    </div>
                  </div>

                  <div className="p-4 bg-muted rounded-lg">
                    <p className="font-semibold mb-2">Scene Summary</p>
                    <p className="leading-tight text-sm">
                      {analysis.scene_summary}
                    </p>
                  </div>

                  {analysis.safety_violations.length > 0 && (
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="font-semibold mb-2">Safety Violations</p>
                      <div className="space-y-2">
                        {analysis.safety_violations.map((violation, index) => (
                          <div
                            key={index}
                            className="p-2 bg-background rounded border"
                          >
                            <p className="font-medium flex items-center justify-between">
                              {violation.type}
                              <span
                                className={`px-2 py-1 rounded-full text-xs ${
                                  violation.severity.toLowerCase() === "high"
                                    ? "bg-red-100 text-red-800"
                                    : violation.severity.toLowerCase() ===
                                        "medium"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-blue-100 text-blue-800"
                                }`}
                              >
                                {violation.severity}
                              </span>
                            </p>
                            <p className="text-sm text-muted-foreground leading-tight">
                              {violation.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
