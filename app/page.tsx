"use client";

import { useEffect, useMemo, useState } from "react";
import RichTextEditor from "./components/RichTextEditor";
import { supabase } from "./lib/supabase";
import type { Doc } from "./types";

const USERS = [
  "sai@example.com",
  "reviewer@example.com",
  "teammate@example.com",
];

export default function Home() {
  const [currentUser, setCurrentUser] = useState(USERS[0]);
  const [docs, setDocs] = useState<Doc[]>([]);
  const [selected, setSelected] = useState<Doc | null>(null);
  const [sharedDocIds, setSharedDocIds] = useState<string[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [shareEmail, setShareEmail] = useState("");
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const [availableUsers, setAvailableUsers] = useState<string[]>(USERS);

  async function loadDocs() {
    const { data: owned } = await supabase
      .from("documents")
      .select("*")
      .eq("owner_email", currentUser)
      .order("updated_at", { ascending: false });

    const { data: shares } = await supabase
      .from("document_shares")
      .select("document_id")
      .eq("shared_with_email", currentUser);

    const ids = (shares || []).map((s) => s.document_id);
    setSharedDocIds(ids);

    let sharedDocs: Doc[] = [];
    if (ids.length) {
      const { data } = await supabase
        .from("documents")
        .select("*")
        .in("id", ids);

      sharedDocs = data || [];
    }

    const all = [...(owned || []), ...sharedDocs];
    setDocs(all);

    if (selected) {
      const refreshed = all.find((d) => d.id === selected.id);
      if (refreshed) {
        setSelected(refreshed);
        setTitle(refreshed.title);
        setContent(refreshed.content || "");
      }
    }
  }

  async function loadAvailableUsers() {
    const { data: docsData } = await supabase
      .from("documents")
      .select("owner_email");

    const { data: sharesData } = await supabase
      .from("document_shares")
      .select("shared_with_email");

    const emails = new Set<string>(USERS);

    docsData?.forEach((d) => emails.add(d.owner_email));
    sharesData?.forEach((s) => emails.add(s.shared_with_email));

    setAvailableUsers(Array.from(emails));
  }

  useEffect(() => {
    loadDocs();
    loadAvailableUsers();
  }, [currentUser]);

  useEffect(() => {
    if (!selected) return;

    setSaveStatus("saving");

    const timer = setTimeout(async () => {
      const { error } = await supabase
        .from("documents")
        .update({
          title,
          content,
          updated_at: new Date().toISOString(),
        })
        .eq("id", selected.id);

      if (!error) {
        setSaveStatus("saved");
        loadDocs();
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [title, content, selected?.id]);

  const ownedDocs = useMemo(
    () => docs.filter((d) => d.owner_email === currentUser),
    [docs, currentUser]
  );

  const sharedDocs = useMemo(
    () => docs.filter((d) => d.owner_email !== currentUser),
    [docs, currentUser]
  );

  async function createDoc() {
    const { data, error } = await supabase
      .from("documents")
      .insert({
        title: "Untitled document",
        content: "<p>Start writing...</p>",
        owner_email: currentUser,
      })
      .select()
      .single();

    if (error) {
      alert(error.message);
      return;
    }

    setSelected(data);
    setSelectedDocId(data.id);
    setTitle(data.title);
    setContent(data.content);
    loadDocs();
  }

  async function saveDoc() {
    if (!selected) return;

    const { error } = await supabase
      .from("documents")
      .update({
        title,
        content,
        updated_at: new Date().toISOString(),
      })
      .eq("id", selected.id);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Saved");
    loadDocs();
  }

  function exportMarkdown() {
    if (!selected) return;

    const plainText = content
      .replaceAll("</p>", "\n")
      .replaceAll("<br>", "\n")
      .replace(/<[^>]+>/g, "");

    const blob = new Blob([plainText], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${title || "document"}.md`;
    a.click();

    URL.revokeObjectURL(url);
  }

  async function shareDoc() {
    if (!selected || !shareEmail.trim()) return;

    if (selected.owner_email !== currentUser) {
      alert("Only owner can share this document.");
      return;
    }

    const { error } = await supabase.from("document_shares").insert({
      document_id: selected.id,
      shared_with_email: shareEmail.trim(),
    });

    if (error) {
      alert(error.message);
      return;
    }

    setShareEmail("");
    alert("Document shared");
    loadAvailableUsers();
    loadDocs();
  }

  async function uploadFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const text = await file.text();

    const { data, error } = await supabase
      .from("documents")
      .insert({
        title: file.name.replace(/\.[^/.]+$/, ""),
        content: `<pre>${text.replaceAll("<", "&lt;").replaceAll(">", "&gt;")}</pre>`,
        owner_email: currentUser,
      })
      .select()
      .single();

    if (error) {
      alert(error.message);
      return;
    }

    setDocs((prev) => [data, ...prev]);
    setSelected(data);
    setSelectedDocId(data.id);
    setTitle(data.title);
    setContent(data.content);
    setSaveStatus("saved");

    await loadAvailableUsers();

    e.target.value = "";
  }

  function openDoc(doc: Doc) {
    setSelected(doc);
    setSelectedDocId(doc.id);
    setTitle(doc.title);
    setContent(doc.content || "");
  }

  return (
    <main className="min-h-screen bg-slate-100 p-6 text-slate-900">
      <div className="mx-auto max-w-7xl">
        <header className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Ajaia Docs</h1>
            <p className="text-slate-600">
              Lightweight collaborative document editor
            </p>
          </div>

          <select
            className="rounded border bg-white p-2"
            value={currentUser}
            onChange={(e) => {
              setCurrentUser(e.target.value);
              setSelected(null);
              setSelectedDocId(null);
            }}
          >
            {availableUsers.map((u) => (
              <option key={u}>{u}</option>
            ))}
          </select>
        </header>

        <div className="grid grid-cols-12 gap-6">
          <aside className="col-span-3 rounded-xl bg-white p-4 shadow">
            <button
              onClick={createDoc}
              className="mb-3 w-full cursor-pointer rounded bg-black px-4 py-2 text-white"
            >
              + New Document
            </button>

            <label className="mb-5 block cursor-pointer rounded border p-3 text-center text-sm">
              Upload .txt / .md
              <input
                type="file"
                accept=".txt,.md"
                className="hidden"
                onChange={uploadFile}
              />
            </label>

            <h2 className="mb-2 font-semibold">Owned Documents</h2>
            <div className="mb-5 space-y-2">
              {ownedDocs.map((doc) => (
                <button
                  key={doc.id}
                  onClick={() => openDoc(doc)}
                  className={`block w-full cursor-pointer rounded border p-2 text-left transition ${
                    selectedDocId === doc.id
                      ? "border-blue-700 bg-blue-200 shadow-sm"
                      : "border-slate-200 bg-white hover:bg-slate-100"
                  }`}
                >
                  <div className="font-medium">{doc.title}</div>
                  <div className="text-xs text-slate-500">Owner: you</div>
                </button>
              ))}
            </div>

            <h2 className="mb-2 font-semibold">Shared With Me</h2>
            <div className="space-y-2">
              {sharedDocs.map((doc) => (
                <button
                  key={doc.id}
                  onClick={() => openDoc(doc)}
                  className={`block w-full cursor-pointer rounded border p-2 text-left transition ${
                    selectedDocId === doc.id
                      ? "border-blue-700 bg-blue-200 shadow-sm"
                      : "border-slate-200 bg-white hover:bg-slate-100"
                  }`}
                >
                  <div className="font-medium">{doc.title}</div>
                  <div className="text-xs text-slate-500">
                    Owner: {doc.owner_email}
                  </div>
                </button>
              ))}
            </div>
          </aside>

          <section className="col-span-9 rounded-xl bg-white p-5 shadow">
            {!selected ? (
              <div className="flex h-[500px] items-center justify-center text-slate-500">
                Create, upload, or select a document.
              </div>
            ) : (
              <>
                <div className="mb-4 flex gap-2">
                  <input
                    className="flex-1 rounded border p-2 text-xl font-semibold"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />

                  <button
                    onClick={saveDoc}
                    className="cursor-pointer rounded bg-blue-600 px-4 py-2 text-white"
                  >
                    Save
                  </button>

                  <button
                    onClick={exportMarkdown}
                    className="cursor-pointer rounded bg-slate-700 px-4 py-2 text-white"
                  >
                    Export .md
                  </button>

                  <span className="self-center text-sm text-slate-500">
                    {saveStatus === "saving" && "Saving..."}
                    {saveStatus === "saved" && "Saved"}
                  </span>
                </div>

                <RichTextEditor
                  key={selectedDocId}
                  content={content}
                  onChange={setContent}
                />

                <div className="mt-5 rounded border p-4">
                  <h3 className="mb-2 font-semibold">Sharing</h3>

                  {selected.owner_email === currentUser ? (
                    <div className="flex gap-2">
                      <input
                        className="flex-1 rounded border p-2"
                        placeholder="Enter teammate email"
                        value={shareEmail}
                        onChange={(e) => setShareEmail(e.target.value)}
                      />
                      <button
                        onClick={shareDoc}
                        className="cursor-pointer rounded bg-slate-900 px-4 py-2 text-white"
                      >
                        Share
                      </button>
                    </div>
                  ) : (
                    <p className="text-sm text-slate-600">
                      This document is shared with you. You can view and edit it
                      in this prototype.
                    </p>
                  )}

                  <p className="mt-2 text-xs text-slate-500">
                    Current user: {currentUser}
                  </p>
                </div>
              </>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}