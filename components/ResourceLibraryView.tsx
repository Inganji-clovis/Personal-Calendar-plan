"use client";

import React, { useState, useMemo } from "react";
import { ResourceItem, SessionType } from "@/lib/supabase";

interface ResourceLibraryViewProps {
  resources: ResourceItem[];
  activeSession: SessionType;
  onAddResource: () => void;
  onEditResource: (resource: ResourceItem) => void;
  onDeleteResource: (id: string) => void;
  onToggleFavorite: (id: string, isFavorite: boolean) => void;
}

const TYPE_ICONS: Record<string, string> = {
  pdf: "📄",
  document: "📝",
  video_link: "🎥",
  ebook: "📚",
  website: "🌐",
  documentation: "📖",
  tutorial: "🎓",
  snippet: "💻",
  tool: "🛠️",
  note: "📌",
};

export const ResourceLibraryView: React.FC<ResourceLibraryViewProps> = ({
  resources,
  activeSession,
  onAddResource,
  onEditResource,
  onDeleteResource,
  onToggleFavorite,
}) => {
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedSession, setSelectedSession] = useState<string>("all");
  const [onlyFavorites, setOnlyFavorites] = useState(false);

  const filteredResources = useMemo(() => {
    return resources.filter((item) => {
      if (onlyFavorites && !item.is_favorite) return false;
      if (selectedType !== "all" && item.resource_type !== selectedType) return false;
      if (selectedSession !== "all" && item.related_session !== selectedSession) return false;
      if (search.trim()) {
        const query = search.toLowerCase();
        const inTitle = item.title.toLowerCase().includes(query);
        const inCategory = item.category?.toLowerCase().includes(query);
        const inTags = item.tags?.toLowerCase().includes(query);
        const inDesc = item.description?.toLowerCase().includes(query);
        if (!inTitle && !inCategory && !inTags && !inDesc) return false;
      }
      return true;
    });
  }, [resources, search, selectedType, selectedSession, onlyFavorites]);

  const countByType = useMemo(() => {
    const counts: Record<string, number> = { all: resources.length };
    resources.forEach((r) => {
      counts[r.resource_type] = (counts[r.resource_type] || 0) + 1;
    });
    return counts;
  }, [resources]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 backdrop-blur">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Knowledge Repository
            </span>
            <span className="text-xs text-slate-400">
              {resources.length} saved resources
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Central Resource Library</h1>
          <p className="text-sm text-slate-400 mt-1">
            Access, organize, and inspect your study notes, technical manuals, documentation, and tools across Home, Studio, and University.
          </p>
        </div>
        <button
          onClick={onAddResource}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm transition-all shadow-lg shadow-emerald-900/30 active:scale-95"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Resource
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900/40 border border-slate-800/60 rounded-2xl p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-6 relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, topic, tags, keywords..."
              className="w-full bg-slate-950/70 border border-slate-800 text-white rounded-xl px-4 py-2.5 pl-10 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
            />
            <svg
              className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <div className="md:col-span-3">
            <select
              value={selectedSession}
              onChange={(e) => setSelectedSession(e.target.value)}
              className="w-full bg-slate-950/70 border border-slate-800 text-white rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-500"
            >
              <option value="all">All Sessions</option>
              <option value="home">Home Session (IT / Dev)</option>
              <option value="studio">Iwacu Studio (Production / Print)</option>
              <option value="university">University of Kigali (Academics)</option>
              <option value="general">General Life & Systems</option>
            </select>
          </div>

          <div className="md:col-span-3 flex items-center gap-2">
            <button
              onClick={() => setOnlyFavorites(!onlyFavorites)}
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium transition-colors ${
                onlyFavorites
                  ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                  : "bg-slate-950/70 text-slate-400 border-slate-800 hover:text-white"
              }`}
            >
              <span>⭐</span>
              <span>{onlyFavorites ? "Favorites Only" : "Show Favorites"}</span>
            </button>
          </div>
        </div>

        {/* Type pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {[
            { id: "all", label: "All Formats" },
            { id: "documentation", label: "Documentation" },
            { id: "pdf", label: "PDF Documents" },
            { id: "tutorial", label: "Tutorials" },
            { id: "video_link", label: "Video Links" },
            { id: "snippet", label: "Code Snippets" },
            { id: "ebook", label: "E-Books" },
            { id: "note", label: "Quick Notes" },
            { id: "tool", label: "Tools" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedType(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                selectedType === tab.id
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  : "bg-slate-950/50 text-slate-400 border border-slate-800/80 hover:text-white"
              }`}
            >
              <span>{tab.id !== "all" ? TYPE_ICONS[tab.id] || "📁" : "📚"}</span>
              <span>{tab.label}</span>
              {countByType[tab.id] ? (
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-800 text-slate-300">
                  {countByType[tab.id]}
                </span>
              ) : null}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Resources */}
      {filteredResources.length === 0 ? (
        <div className="bg-slate-900/30 border border-slate-800/60 rounded-2xl p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-800/60 flex items-center justify-center text-3xl">
            📚
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">No resources match your filters</h3>
          <p className="text-sm text-slate-400 max-w-md mx-auto mb-6">
            Store course syllabus, cheat sheets, manual links for laser/UV printers, and IT learning material here.
          </p>
          <button
            onClick={onAddResource}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium transition-colors"
          >
            Add Your First Resource
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredResources.map((item) => {
            const sessionBadgeColor =
              item.related_session === "home"
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                : item.related_session === "studio"
                ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                : item.related_session === "university"
                ? "bg-purple-500/10 text-purple-400 border-purple-500/20"
                : "bg-slate-700/30 text-slate-300 border-slate-700/50";

            return (
              <div
                key={item.id}
                className="group bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 rounded-2xl p-5 flex flex-col justify-between transition-all hover:shadow-xl hover:shadow-black/40"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <span className="text-2xl">{TYPE_ICONS[item.resource_type] || "📄"}</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => onToggleFavorite(item.id, !item.is_favorite)}
                        title={item.is_favorite ? "Remove favorite" : "Mark favorite"}
                        className={`p-1.5 rounded-lg text-sm transition-colors ${
                          item.is_favorite ? "text-amber-400 hover:text-amber-300" : "text-slate-600 hover:text-slate-400"
                        }`}
                      >
                        {item.is_favorite ? "★" : "☆"}
                      </button>
                      <button
                        onClick={() => onEditResource(item)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-slate-200 transition-colors"
                        title="Edit resource"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => onDeleteResource(item.id)}
                        className="p-1.5 rounded-lg text-slate-600 hover:text-rose-400 transition-colors"
                        title="Delete resource"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <h3 className="text-base font-semibold text-white group-hover:text-emerald-400 transition-colors line-clamp-2">
                    {item.title}
                  </h3>

                  {item.description ? (
                    <p className="text-xs text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                      {item.description}
                    </p>
                  ) : null}

                  <div className="flex flex-wrap gap-1.5 mt-4">
                    <span className="text-[11px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-medium capitalize">
                      {item.resource_type.replace("_", " ")}
                    </span>
                    <span className={`text-[11px] px-2 py-0.5 rounded-md border font-medium ${sessionBadgeColor}`}>
                      {item.related_session === "home"
                        ? "Home / IT"
                        : item.related_session === "studio"
                        ? "Iwacu Studio"
                        : item.related_session === "university"
                        ? "University"
                        : "General"}
                    </span>
                    {item.category ? (
                      <span className="text-[11px] px-2 py-0.5 rounded-md bg-slate-800/80 text-slate-400 border border-slate-700/50">
                        {item.category}
                      </span>
                    ) : null}
                  </div>

                  {item.tags ? (
                    <div className="text-[11px] text-slate-500 mt-2 line-clamp-1">
                      🏷️ {item.tags}
                    </div>
                  ) : null}
                </div>

                <div className="mt-5 pt-3 border-t border-slate-800/60 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">
                    {item.created_at ? new Date(item.created_at).toLocaleDateString() : "Saved"}
                  </span>
                  {item.url ? (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-400 hover:text-emerald-300 transition-colors"
                    >
                      Open Link
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  ) : (
                    <span className="text-xs text-slate-600">Local Note</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

