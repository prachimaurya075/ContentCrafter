import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  Code2,
  Globe,
  Loader2,
  Mic,
  MicOff,
  Paperclip,
  Square,
  X,
  User,
} from "lucide-react";
import { PREMIUM_TEMPLATES } from "../constants/premium-templates";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { WritingPromptsToolbar } from "./writing-prompts-toolbar";

export const ChatInput = ({
  className,
  sendMessage,
  isGenerating,
  onStopGenerating,
  placeholder = "Ask me to write something, or paste text to improve...",
  value,
  onValueChange,
  textareaRef: externalTextareaRef,
  showPromptToolbar = false,
  isWebSearchEnabled = false,
  onToggleWebSearch,
  backendUrl,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [mode, setMode] = useState(isWebSearchEnabled ? "search" : "content-writer");
  const [selectedPersona, setSelectedPersona] = useState(PREMIUM_TEMPLATES.personas[0]);
  const [attachedFiles, setAttachedFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const recognitionRef = useRef(null);
  const internalTextareaRef = useRef(null);
  const textareaRef = externalTextareaRef || internalTextareaRef;

  useEffect(() => {
    setMode(isWebSearchEnabled ? "search" : "chat");
  }, [isWebSearchEnabled]);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setVoiceSupported(false);
      return;
    }

    setVoiceSupported(true);
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        transcript += event.results[i][0].transcript;
      }
      const existingValue = value?.trim() ? `${value.trim()} ` : "";
      onValueChange(`${existingValue}${transcript}`.trimStart());
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.onresult = null;
        recognitionRef.current.onend = null;
        recognitionRef.current.onerror = null;
      }
    };
  }, [onValueChange, value]);

  const handlePromptSelect = (prompt) => {
    onValueChange(value ? `${value.trim()} ${prompt}` : prompt);
    textareaRef.current?.focus();
  };

  const updateTextareaHeight = useCallback(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      const scrollHeight = textarea.scrollHeight;
      const maxHeight = 120;
      const textareaHeight = Math.min(scrollHeight, maxHeight);
      textarea.style.height = `${textareaHeight}px`;
    }
  }, [textareaRef]);

  useEffect(() => {
    updateTextareaHeight();
  }, [value, updateTextareaHeight]);

  const handleModeChange = (nextMode) => {
    setMode(nextMode);
    const persona = PREMIUM_TEMPLATES.personas.find(p => p.id === nextMode);
    if (persona) setSelectedPersona(persona);
    if (nextMode === "search" && !isWebSearchEnabled) {
      onToggleWebSearch?.();
    }
    if (nextMode !== "search" && isWebSearchEnabled) {
      onToggleWebSearch?.();
    }
  };

  const handlePersonaPrepend = () => {
    const fullPrompt = `${selectedPersona.prefix}${PREMIUM_TEMPLATES.systemPrompt}\n\n`;
    onValueChange(value ? fullPrompt + value.trim() : fullPrompt);
    textareaRef.current?.focus();
  };

  const handleFilePicker = () => {
    fileInputRef.current?.click();
  };

  const handleFilesSelected = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setAttachedFiles((prev) => {
      const mapped = files.map((file) => ({ name: file.name, file }));
      return [...prev, ...mapped].slice(0, 5);
    });
    e.target.value = "";
  };

  const handleRemoveFile = (name) => {
    setAttachedFiles((prev) => prev.filter((file) => file.name !== name));
  };

  const handleVoiceInput = () => {
    if (!voiceSupported || !recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    try {
      recognitionRef.current.start();
      setIsListening(true);
      textareaRef.current?.focus();
    } catch (_error) {
      setIsListening(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = value.trim();
    if ((!trimmed && attachedFiles.length === 0) || isLoading || isGenerating || !sendMessage) {
      return;
    }

    setIsLoading(true);
    try {
      let summaryBlocks = [];
      if (attachedFiles.length > 0) {
        if (!backendUrl) {
          summaryBlocks.push("File upload unavailable (missing backend URL).");
          toast.error("Backend URL missing. File upload skipped.");
        } else {
          setIsUploading(true);
          const responses = await Promise.all(
            attachedFiles.map(async ({ name, file }) => {
              const formData = new FormData();
              formData.append("file", file);
              const response = await fetch(`${backendUrl}/api/v1/ai/summarize/file`, {
                method: "POST",
                body: formData,
              });

              if (!response.ok) {
                throw new Error(`Upload failed (${name})`);
              }
              const data = await response.json();
              return { name, summary: data?.data?.summary || "No summary returned." };
            })
          );

          summaryBlocks = responses.map(
            (item) => `Summary of ${item.name}:\n${item.summary}`
          );
          toast.success(
            responses.length === 1
              ? "File summarized"
              : `${responses.length} files summarized`
          );
        }
      }

      const composed = [trimmed, ...summaryBlocks].filter(Boolean).join("\n\n");
      await sendMessage({ text: composed });
      onValueChange("");
      setAttachedFiles([]);
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error(error?.message || "Upload failed");
    } finally {
      setIsUploading(false);
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div
      className={cn(
        "flex flex-col bg-background",
        showPromptToolbar && "border-t border-border/50"
      )}
    >
      {showPromptToolbar && (
        <WritingPromptsToolbar onPromptSelect={handlePromptSelect} />
      )}
      <div className={cn("p-4", className)}>
        <form onSubmit={handleSubmit}>
className="relative rounded-3xl border border-border/50 bg-background/90 shadow-xl hover:shadow-2xl active:shadow-2xl transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-400 focus-within:shadow-2xl focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-400/50 backdrop-blur-md"
"flex items-center gap-1.5 px-4 pt-4 hover:gap-2 transition-all"
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="h-9 w-9 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/40"
                onClick={handleFilePicker}
                title="Attach file"
              >
                <Paperclip className="h-4 w-4" />
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.txt"
                multiple
                className="hidden"
                onChange={handleFilesSelected}
              />

              <div className="flex items-center gap-1 rounded-full bg-muted/60 p-1 text-xs">
                {PREMIUM_TEMPLATES.personas.map((persona) => (
                  <Button
                    key={persona.id}
                    type="button"
                    size="sm"
                    variant={mode === persona.id ? "secondary" : "ghost"}
                    className="h-7 rounded-full px-2"
                    onClick={() => handleModeChange(persona.id)}
                  >
                    {persona.icon === '💻' ? <Code2 className="h-3.5 w-3.5 mr-1" /> : 
                     persona.icon === '🎤' ? <User className="h-3.5 w-3.5 mr-1" /> : null}
                    <span className="max-w-16 truncate">{persona.name.slice(0,3)}</span>
                  </Button>
                ))}
                <Button
                  type="button"
                  size="sm"
                  variant={mode === "search" ? "secondary" : "ghost"}
                  className="h-7 rounded-full px-2"
                  onClick={() => handleModeChange("search")}
                >
                  <Globe className="h-3.5 w-3.5" />
                </Button>
                <Button
                  onClick={handlePersonaPrepend}
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-xs"
                  title={`Prepend ${selectedPersona.name} + System Prompt`}
                >
                  AI
                </Button>
              </div>

              <div className="ml-auto flex items-center gap-2">
                <Button
                  type="button"
                  size="icon"
                  variant={isListening ? "destructive" : "ghost"}
                  className={cn(
                    "h-9 w-9 rounded-full",
                    isListening
                      ? "text-white"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                  )}
                  onClick={handleVoiceInput}
                  disabled={!voiceSupported}
                  title={
                    voiceSupported ? "Voice input" : "Voice input not supported"
                  }
                >
                  {isListening ? (
                    <MicOff className="h-4 w-4" />
                  ) : (
                    <Mic className="h-4 w-4" />
                  )}
                </Button>
                {isUploading && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Uploading
                  </div>
                )}
              </div>
            </div>

            <Textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => onValueChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              className={cn(
                "min-h-11 max-h-30 resize-none px-4 pb-12 pt-3 text-sm",
                "border-0 focus-visible:ring-0 focus-visible:ring-offset-0",
                "rounded-2xl bg-transparent"
              )}
              disabled={isLoading || isGenerating}
            />

            {attachedFiles.length > 0 && (
              <div className="flex flex-wrap gap-2 px-4 pb-3">
                {attachedFiles.map(({ name }) => (
                  <div
                    key={name}
                    className="flex items-center gap-2 rounded-full border border-border/60 bg-muted/50 px-3 py-1 text-xs text-muted-foreground"
                  >
                    <span className="max-w-40 truncate">{name}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveFile(name)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {value.trim() && !isLoading && !isGenerating && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => onValueChange("")}
                className="absolute right-12 bottom-3 h-8 w-8 rounded-full text-muted-foreground hover:text-foreground"
                title="Clear text"
              >
                <X className="h-4 w-4" />
              </Button>
            )}

            {isGenerating ? (
              <Button
                type="button"
                onClick={onStopGenerating}
                className="absolute right-3 bottom-3 h-9 w-9 rounded-full shrink-0 p-0"
                variant="destructive"
                title="Stop generating"
              >
                <Square className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={!value.trim() || isLoading || isGenerating || isUploading}
                className={cn(
                  "absolute right-3 bottom-3 h-9 w-9 rounded-full shrink-0 p-0",
                  "transition-all duration-200",
                  "disabled:opacity-30 disabled:cursor-not-allowed",
                  !value.trim() ? "bg-muted hover:bg-muted" : ""
                )}
                variant={value.trim() ? "default" : "ghost"}
              >
                <ArrowRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
