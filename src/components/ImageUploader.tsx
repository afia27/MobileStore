"use client";

import React, { useRef, useState } from "react";

export default function ImageUploader({ value, onChange }: { value: string[]; onChange: (urls: string[]) => void }) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const onSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await fetch("/api/upload/sign", { method: "POST" });
      const { timestamp, signature, apiKey, cloudName } = await res.json();
      const form = new FormData();
      form.append("file", file);
      form.append("api_key", apiKey);
      form.append("timestamp", timestamp);
      form.append("signature", signature);
      const up = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, { method: "POST", body: form });
      const data = await up.json();
      onChange([...(value || []), data.secure_url as string]);
      if (inputRef.current) inputRef.current.value = "";
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2 flex-wrap">
        {(value || []).map((url, idx) => (
          <div key={idx} className="w-24 h-24 border rounded overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt="uploaded" className="w-full h-full object-cover" />
          </div>
        ))}
      </div>
      <input ref={inputRef} type="file" accept="image/*" onChange={onSelect} />
      {uploading && <div className="text-sm text-gray-600">Uploading...</div>}
    </div>
  );
}


