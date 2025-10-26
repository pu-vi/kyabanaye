"use client";

import React, { useState } from "react";

interface ShareData {
  title?: string;
  text?: string;
  url?: string;
  files?: File[];
}

export default function ShareButton() {
  const [isSharing, setIsSharing] = useState(false);
  const [shareResult, setShareResult] = useState<string>("");

  const handleShare = async (shareType: "link" | "text" | "file") => {
    setIsSharing(true);
    setShareResult("");

    try {
      let shareData: ShareData = {};

      switch (shareType) {
        case "link":
          shareData = {
            title: "Check out Uramu PWA!",
            text: "A Progressive Web App built with Next.js",
            url: window.location.href
          };
          break;
        case "text":
          shareData = {
            title: "Shared Text",
            text: "This is some sample text being shared from Uramu PWA! 🚀"
          };
          break;
        case "file":
          // Create a simple text file to share
          const textContent = "This is a sample file from Uramu PWA!";
          const file = new File([textContent], "sample.txt", {
            type: "text/plain"
          });
          shareData = {
            title: "Shared File",
            text: "Sharing a sample file from Uramu PWA",
            files: [file]
          };
          break;
      }

      // Check if native Web Share API is available
      if (
        navigator.share &&
        (!shareData.files || navigator.canShare?.(shareData))
      ) {
        await navigator.share(shareData);
        setShareResult(
          "✅ Content shared successfully using native Web Share API!"
        );
      } else {
        // Fallback: send to our API
        const response = await fetch("/api/share", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(shareData)
        });

        const result = await response.json();

        if (result.success) {
          setShareResult("✅ Content sent to share API successfully!");
        } else {
          setShareResult("❌ Failed to process share request");
        }
      }
    } catch (error) {
      console.error("Error sharing:", error);
      if ((error as Error).name === "AbortError") {
        setShareResult("❌ Share was cancelled");
      } else {
        setShareResult("❌ Error occurred while sharing");
      }
    } finally {
      setIsSharing(false);
    }
  };

  const isWebShareSupported =
    typeof navigator !== "undefined" && !!navigator.share;

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      <h2 className="text-xl font-semibold text-center mb-4">
        🔗 Web Share API Demo
      </h2>

      <div className="text-sm text-gray-600 dark:text-gray-400 text-center mb-4">
        {isWebShareSupported
          ? "✅ Native Web Share API is supported"
          : "⚠️ Native Web Share API not supported, using fallback"}
      </div>

      <div className="space-y-3">
        <button
          onClick={() => handleShare("link")}
          disabled={isSharing}
          className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium transition-colors"
        >
          {isSharing ? "Sharing..." : "📲 Share This Page"}
        </button>

        <button
          onClick={() => handleShare("text")}
          disabled={isSharing}
          className="w-full px-4 py-3 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-lg font-medium transition-colors"
        >
          {isSharing ? "Sharing..." : "📝 Share Text"}
        </button>

        <button
          onClick={() => handleShare("file")}
          disabled={isSharing}
          className="w-full px-4 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white rounded-lg font-medium transition-colors"
        >
          {isSharing ? "Sharing..." : "📎 Share File"}
        </button>
      </div>

      {shareResult && (
        <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg text-center text-sm">
          {shareResult}
        </div>
      )}
    </div>
  );
}
