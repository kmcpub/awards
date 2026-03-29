/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Settings, Maximize, Minimize, RotateCcw, X, Save, Trash2, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ParticleBackground from './components/ParticleBackground';
import FlyingTextManager from './components/FlyingTextManager';
import DraggableText from './components/DraggableText';

const FONTS = [
  { label: '명조체 (Serif)', value: 'serif' },
  { label: '고딕체 (Sans-serif)', value: 'sans-serif' },
  { label: '바탕체 (Batang)', value: '"Batang", "Times New Roman", serif' },
  { label: '궁서체 (Gungsuh)', value: '"Gungsuh", cursive' },
  { label: '고정폭 (Monospace)', value: 'monospace' },
  { label: '노토 산스 (Noto Sans KR)', value: '"Noto Sans KR", sans-serif' },
  { label: '노토 세리프 (Noto Serif KR)', value: '"Noto Serif KR", serif' },
  { label: '나눔고딕 (Nanum Gothic)', value: '"Nanum Gothic", sans-serif' },
  { label: '나눔명조 (Nanum Myeongjo)', value: '"Nanum Myeongjo", serif' },
  { label: '나눔펜스크립트 (Nanum Pen Script)', value: '"Nanum Pen Script", cursive' },
  { label: '도현 (Do Hyeon)', value: '"Do Hyeon", sans-serif' },
  { label: '주아 (Jua)', value: '"Jua", sans-serif' },
  { label: '블랙한산스 (Black Han Sans)', value: '"Black Han Sans", sans-serif' },
  { label: '구기 (Gugi)', value: '"Gugi", cursive' },
  { label: '연성 (Yeon Sung)', value: '"Yeon Sung", cursive' },
  { label: '송명 (Song Myung)', value: '"Song Myung", serif' },
  { label: '스타일리시 (Stylish)', value: '"Stylish", sans-serif' },
  { label: '감자꽃 (Gamja Flower)', value: '"Gamja Flower", cursive' },
  { label: '고운바탕 (Gowun Batang)', value: '"Gowun Batang", serif' },
  { label: '고운돋움 (Gowun Dodum)', value: '"Gowun Dodum", sans-serif' },
  { label: '푸어스토리 (Poor Story)', value: '"Poor Story", cursive' },
  { label: '함렛 (Hahmlet)', value: '"Hahmlet", serif' },
  { label: 'IBM 폰트 (IBM Plex Sans KR)', value: '"IBM Plex Sans KR", sans-serif' },
  { label: '동글 (Dongle)', value: '"Dongle", sans-serif' },
  { label: '싱글데이 (Single Day)', value: '"Single Day", cursive' },
];

const DEFAULT_STATE = {
  title: "2026 AWARDS",
  subtitle: "CELEBRATING EXCELLENCE",
  bgTexts: "GLORY\nHONOR\nACHIEVEMENT\nSUCCESS\nBRILLIANCE\nPRESTIGE",
  titleSize: 8,
  subtitleSize: 3,
  bgTextSize: 1,
  titleFont: FONTS[0].value,
  subtitleFont: FONTS[0].value,
  bgTextFont: FONTS[0].value,
  titleBold: true,
  subtitleBold: false,
  bgTextBold: false,
  bgTextSpeed: 1,
  bgTextMaxCount: 8,
  bgTextOpacity: 1,
  showLights: true,
  showAurora: false,
  showWaves: true,
  waveBrightness: 0.2,
};

export default function App() {
  const [title, setTitle] = useState(DEFAULT_STATE.title);
  const [subtitle, setSubtitle] = useState(DEFAULT_STATE.subtitle);
  const [bgTexts, setBgTexts] = useState(DEFAULT_STATE.bgTexts);
  const [titleSize, setTitleSize] = useState(DEFAULT_STATE.titleSize);
  const [subtitleSize, setSubtitleSize] = useState(DEFAULT_STATE.subtitleSize);
  const [bgTextSize, setBgTextSize] = useState(DEFAULT_STATE.bgTextSize);
  
  const [titleFont, setTitleFont] = useState(DEFAULT_STATE.titleFont);
  const [subtitleFont, setSubtitleFont] = useState(DEFAULT_STATE.subtitleFont);
  const [bgTextFont, setBgTextFont] = useState(DEFAULT_STATE.bgTextFont);
  
  const [titleBold, setTitleBold] = useState(DEFAULT_STATE.titleBold);
  const [subtitleBold, setSubtitleBold] = useState(DEFAULT_STATE.subtitleBold);
  const [bgTextBold, setBgTextBold] = useState(DEFAULT_STATE.bgTextBold);

  const [bgTextSpeed, setBgTextSpeed] = useState(DEFAULT_STATE.bgTextSpeed);
  const [bgTextMaxCount, setBgTextMaxCount] = useState(DEFAULT_STATE.bgTextMaxCount);
  const [bgTextOpacity, setBgTextOpacity] = useState(DEFAULT_STATE.bgTextOpacity);
  
  const [showLights, setShowLights] = useState(DEFAULT_STATE.showLights);
  const [showAurora, setShowAurora] = useState(DEFAULT_STATE.showAurora);
  const [showWaves, setShowWaves] = useState(DEFAULT_STATE.showWaves);
  const [waveBrightness, setWaveBrightness] = useState(DEFAULT_STATE.waveBrightness);
  
  const [showSettings, setShowSettings] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const [presets, setPresets] = useState<Record<string, typeof DEFAULT_STATE>>({});
  const [presetName, setPresetName] = useState('');
  const [editingPreset, setEditingPreset] = useState<string | null>(null);
  const [editPresetName, setEditPresetName] = useState('');

  // Load from local storage
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem('award_current_settings');
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        setTitle(parsed.title ?? DEFAULT_STATE.title);
        setSubtitle(parsed.subtitle ?? DEFAULT_STATE.subtitle);
        setBgTexts(parsed.bgTexts ?? DEFAULT_STATE.bgTexts);
        setTitleSize(parsed.titleSize ?? DEFAULT_STATE.titleSize);
        setSubtitleSize(parsed.subtitleSize ?? DEFAULT_STATE.subtitleSize);
        setBgTextSize(parsed.bgTextSize ?? DEFAULT_STATE.bgTextSize);
        setTitleFont(parsed.titleFont ?? DEFAULT_STATE.titleFont);
        setSubtitleFont(parsed.subtitleFont ?? DEFAULT_STATE.subtitleFont);
        setBgTextFont(parsed.bgTextFont ?? DEFAULT_STATE.bgTextFont);
        setTitleBold(parsed.titleBold ?? DEFAULT_STATE.titleBold);
        setSubtitleBold(parsed.subtitleBold ?? DEFAULT_STATE.subtitleBold);
        setBgTextBold(parsed.bgTextBold ?? DEFAULT_STATE.bgTextBold);
        setBgTextSpeed(parsed.bgTextSpeed ?? DEFAULT_STATE.bgTextSpeed);
        setBgTextMaxCount(parsed.bgTextMaxCount ?? DEFAULT_STATE.bgTextMaxCount);
        setBgTextOpacity(parsed.bgTextOpacity ?? DEFAULT_STATE.bgTextOpacity);
        setShowLights(parsed.showLights ?? DEFAULT_STATE.showLights);
        setShowAurora(parsed.showAurora ?? DEFAULT_STATE.showAurora);
        setShowWaves(parsed.showWaves ?? DEFAULT_STATE.showWaves);
        setWaveBrightness(parsed.waveBrightness ?? DEFAULT_STATE.waveBrightness);
      }
      
      const savedPresets = localStorage.getItem('award_presets');
      if (savedPresets) {
        setPresets(JSON.parse(savedPresets));
      }
    } catch (e) {
      console.error("Failed to load settings", e);
    }
  }, []);

  // Save to local storage
  useEffect(() => {
    const currentSettings = {
      title, subtitle, bgTexts,
      titleSize, subtitleSize, bgTextSize,
      titleFont, subtitleFont, bgTextFont,
      titleBold, subtitleBold, bgTextBold,
      bgTextSpeed, bgTextMaxCount, bgTextOpacity,
      showLights, showAurora, showWaves, waveBrightness
    };
    localStorage.setItem('award_current_settings', JSON.stringify(currentSettings));
  }, [
    title, subtitle, bgTexts,
    titleSize, subtitleSize, bgTextSize,
    titleFont, subtitleFont, bgTextFont,
    titleBold, subtitleBold, bgTextBold,
    bgTextSpeed, bgTextMaxCount, bgTextOpacity,
    showLights, showAurora, showWaves, waveBrightness
  ]);

  const handleSavePreset = () => {
    if (!presetName.trim()) return;
    const currentSettings = {
      title, subtitle, bgTexts,
      titleSize, subtitleSize, bgTextSize,
      titleFont, subtitleFont, bgTextFont,
      titleBold, subtitleBold, bgTextBold,
      bgTextSpeed, bgTextMaxCount, bgTextOpacity,
      showLights, showAurora, showWaves
    };
    const newPresets = { ...presets, [presetName]: currentSettings };
    setPresets(newPresets);
    localStorage.setItem('award_presets', JSON.stringify(newPresets));
    setPresetName('');
  };

  const handleLoadPreset = (name: string) => {
    const p = presets[name];
    if (!p) return;
    setTitle(p.title ?? DEFAULT_STATE.title);
    setSubtitle(p.subtitle ?? DEFAULT_STATE.subtitle);
    setBgTexts(p.bgTexts ?? DEFAULT_STATE.bgTexts);
    setTitleSize(p.titleSize ?? DEFAULT_STATE.titleSize);
    setSubtitleSize(p.subtitleSize ?? DEFAULT_STATE.subtitleSize);
    setBgTextSize(p.bgTextSize ?? DEFAULT_STATE.bgTextSize);
    setTitleFont(p.titleFont ?? DEFAULT_STATE.titleFont);
    setSubtitleFont(p.subtitleFont ?? DEFAULT_STATE.subtitleFont);
    setBgTextFont(p.bgTextFont ?? DEFAULT_STATE.bgTextFont);
    setTitleBold(p.titleBold ?? DEFAULT_STATE.titleBold);
    setSubtitleBold(p.subtitleBold ?? DEFAULT_STATE.subtitleBold);
    setBgTextBold(p.bgTextBold ?? DEFAULT_STATE.bgTextBold);
    setBgTextSpeed(p.bgTextSpeed ?? DEFAULT_STATE.bgTextSpeed);
    setBgTextMaxCount(p.bgTextMaxCount ?? DEFAULT_STATE.bgTextMaxCount);
    setBgTextOpacity(p.bgTextOpacity ?? DEFAULT_STATE.bgTextOpacity);
    setShowLights(p.showLights ?? DEFAULT_STATE.showLights);
    setShowAurora(p.showAurora ?? DEFAULT_STATE.showAurora);
    setShowWaves(p.showWaves ?? DEFAULT_STATE.showWaves);
  };

  const handleDeletePreset = (name: string) => {
    const newPresets = { ...presets };
    delete newPresets[name];
    setPresets(newPresets);
    localStorage.setItem('award_presets', JSON.stringify(newPresets));
  };

  const handleRenamePresetSubmit = (oldName: string) => {
    if (!editPresetName.trim() || editPresetName === oldName) {
      setEditingPreset(null);
      return;
    }
    const newPresets = { ...presets };
    newPresets[editPresetName] = newPresets[oldName];
    delete newPresets[oldName];
    setPresets(newPresets);
    localStorage.setItem('award_presets', JSON.stringify(newPresets));
    setEditingPreset(null);
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
      });
    } else {
      await document.exitFullscreen();
    }
  };

  const handleReset = () => {
    setTitle(DEFAULT_STATE.title);
    setSubtitle(DEFAULT_STATE.subtitle);
    setBgTexts(DEFAULT_STATE.bgTexts);
    setTitleSize(DEFAULT_STATE.titleSize);
    setSubtitleSize(DEFAULT_STATE.subtitleSize);
    setBgTextSize(DEFAULT_STATE.bgTextSize);
    setTitleFont(DEFAULT_STATE.titleFont);
    setSubtitleFont(DEFAULT_STATE.subtitleFont);
    setBgTextFont(DEFAULT_STATE.bgTextFont);
    setTitleBold(DEFAULT_STATE.titleBold);
    setSubtitleBold(DEFAULT_STATE.subtitleBold);
    setBgTextBold(DEFAULT_STATE.bgTextBold);
    setBgTextSpeed(DEFAULT_STATE.bgTextSpeed);
    setBgTextMaxCount(DEFAULT_STATE.bgTextMaxCount);
    setBgTextOpacity(DEFAULT_STATE.bgTextOpacity);
    setShowLights(DEFAULT_STATE.showLights);
    setShowAurora(DEFAULT_STATE.showAurora);
    setShowWaves(DEFAULT_STATE.showWaves);
    setWaveBrightness(DEFAULT_STATE.waveBrightness);
  };

  const bgTextArray = bgTexts.split('\n').map(t => t.trim()).filter(t => t !== '');

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black text-white font-serif">
      <ParticleBackground 
        showLights={showLights}
        showAurora={showAurora}
        showWaves={showWaves}
        waveBrightness={waveBrightness}
      />
      <FlyingTextManager 
        texts={bgTextArray} 
        baseSize={bgTextSize} 
        fontFamily={bgTextFont}
        isBold={bgTextBold}
        speedMultiplier={bgTextSpeed}
        maxCount={bgTextMaxCount}
        opacityMultiplier={bgTextOpacity}
      />
      
      <DraggableText
        initialText={title}
        fontSize={titleSize}
        fontFamily={titleFont}
        isBold={titleBold}
        initialPos={{ x: 50, y: 40 }}
        onTextChange={setTitle}
        className="text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 via-yellow-400 to-yellow-600 uppercase tracking-widest"
      />
      
      <DraggableText
        initialText={subtitle}
        fontSize={subtitleSize}
        fontFamily={subtitleFont}
        isBold={subtitleBold}
        initialPos={{ x: 50, y: 55 }}
        onTextChange={setSubtitle}
        className="text-yellow-100 uppercase tracking-[0.3em]"
      />

      {/* Controls */}
      <div className="absolute bottom-6 right-6 z-40 flex gap-3">
        <button
          onClick={toggleFullscreen}
          className="p-2 rounded-full bg-black/20 hover:bg-black/60 text-yellow-500/50 hover:text-yellow-400 transition-all backdrop-blur-sm border border-yellow-500/20"
          title="전체화면 전환"
        >
          {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
        </button>
        <button
          onClick={() => setShowSettings(true)}
          className="p-2 rounded-full bg-black/20 hover:bg-black/60 text-yellow-500/50 hover:text-yellow-400 transition-all backdrop-blur-sm border border-yellow-500/20"
          title="설정"
        >
          <Settings size={20} />
        </button>
      </div>

      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute top-0 right-0 bottom-0 w-96 bg-black/90 backdrop-blur-md border-l border-yellow-500/30 z-50 overflow-y-auto shadow-2xl shadow-black"
          >
            <div className="sticky top-0 bg-black/90 backdrop-blur-md z-20 pb-4 mb-6 border-b border-yellow-500/30 px-6 pt-6 flex justify-between items-center">
              <h2 className="text-2xl font-serif text-yellow-500 tracking-widest uppercase">설정</h2>
              <button onClick={() => setShowSettings(false)} className="text-gray-400 hover:text-white">
                <X size={24} />
              </button>
            </div>

            <div className="space-y-8 font-sans px-6 pb-6">
              {/* Presets */}
              <div className="space-y-3">
                <label className="block text-sm text-yellow-500/80 uppercase tracking-wider font-bold border-b border-yellow-500/20 pb-1">프리셋</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={presetName}
                    onChange={(e) => setPresetName(e.target.value)}
                    placeholder="프리셋 이름"
                    className="flex-1 bg-white/5 border border-yellow-500/30 rounded p-2 text-white text-sm focus:outline-none focus:border-yellow-500"
                  />
                  <button 
                    onClick={handleSavePreset}
                    className="bg-yellow-500/20 hover:bg-yellow-500/40 text-yellow-500 px-3 py-2 rounded transition-colors text-sm flex items-center gap-1"
                  >
                    <Save size={16} /> 저장
                  </button>
                </div>
                {Object.keys(presets).length > 0 && (
                  <div className="space-y-2 mt-2 max-h-32 overflow-y-auto pr-2">
                    {Object.keys(presets).map(name => (
                      <div key={name} className="flex items-center justify-between bg-white/5 p-2 rounded border border-white/10">
                        {editingPreset === name ? (
                          <input
                            autoFocus
                            value={editPresetName}
                            onChange={e => setEditPresetName(e.target.value)}
                            onBlur={() => handleRenamePresetSubmit(name)}
                            onKeyDown={e => e.key === 'Enter' && handleRenamePresetSubmit(name)}
                            className="bg-black/50 text-yellow-500 text-sm border border-yellow-500/50 rounded px-1 w-full mr-2 outline-none"
                          />
                        ) : (
                          <span 
                            className="text-sm text-gray-300 truncate pr-2 cursor-pointer hover:text-yellow-400 transition-colors"
                            onClick={() => { setEditingPreset(name); setEditPresetName(name); }}
                            title="클릭하여 이름 변경"
                          >
                            {name}
                          </span>
                        )}
                        <div className="flex gap-2 shrink-0">
                          <button onClick={() => handleLoadPreset(name)} className="text-yellow-500 hover:text-yellow-400" title="불러오기">
                            <Download size={16} />
                          </button>
                          <button onClick={() => handleDeletePreset(name)} className="text-red-400 hover:text-red-300" title="삭제">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Main Title Settings */}
              <div className="space-y-3">
                <label className="block text-sm text-yellow-500/80 uppercase tracking-wider font-bold border-b border-yellow-500/20 pb-1">메인 제목</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-white/5 border border-yellow-500/30 rounded p-2 text-white focus:outline-none focus:border-yellow-500"
                />
                <div className="flex items-center gap-4">
                  <span className="text-xs text-gray-400 w-12">크기</span>
                  <input
                    type="range"
                    min="2"
                    max="20"
                    step="0.5"
                    value={titleSize}
                    onChange={(e) => setTitleSize(parseFloat(e.target.value))}
                    className="flex-1 accent-yellow-500"
                  />
                  <span className="text-xs text-gray-400 w-8 text-right">{titleSize}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-gray-400 w-12">폰트</span>
                  <select 
                    value={titleFont} 
                    onChange={(e) => setTitleFont(e.target.value)}
                    className="flex-1 bg-white/5 border border-yellow-500/30 rounded p-1 text-white text-sm focus:outline-none"
                    style={{ fontFamily: titleFont }}
                  >
                    {FONTS.map(f => <option key={f.value} value={f.value} className="bg-black" style={{ fontFamily: f.value }}>{f.label}</option>)}
                  </select>
                  <label className="flex items-center gap-1 text-xs text-gray-400 cursor-pointer">
                    <input type="checkbox" checked={titleBold} onChange={(e) => setTitleBold(e.target.checked)} className="accent-yellow-500" />
                    굵게
                  </label>
                </div>
              </div>

              {/* Subtitle Settings */}
              <div className="space-y-3">
                <label className="block text-sm text-yellow-500/80 uppercase tracking-wider font-bold border-b border-yellow-500/20 pb-1">부제목</label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  className="w-full bg-white/5 border border-yellow-500/30 rounded p-2 text-white focus:outline-none focus:border-yellow-500"
                />
                <div className="flex items-center gap-4">
                  <span className="text-xs text-gray-400 w-12">크기</span>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    step="0.5"
                    value={subtitleSize}
                    onChange={(e) => setSubtitleSize(parseFloat(e.target.value))}
                    className="flex-1 accent-yellow-500"
                  />
                  <span className="text-xs text-gray-400 w-8 text-right">{subtitleSize}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-gray-400 w-12">폰트</span>
                  <select 
                    value={subtitleFont} 
                    onChange={(e) => setSubtitleFont(e.target.value)}
                    className="flex-1 bg-white/5 border border-yellow-500/30 rounded p-1 text-white text-sm focus:outline-none"
                    style={{ fontFamily: subtitleFont }}
                  >
                    {FONTS.map(f => <option key={f.value} value={f.value} className="bg-black" style={{ fontFamily: f.value }}>{f.label}</option>)}
                  </select>
                  <label className="flex items-center gap-1 text-xs text-gray-400 cursor-pointer">
                    <input type="checkbox" checked={subtitleBold} onChange={(e) => setSubtitleBold(e.target.checked)} className="accent-yellow-500" />
                    굵게
                  </label>
                </div>
              </div>

              {/* Background Text Settings */}
              <div className="space-y-3">
                <label className="block text-sm text-yellow-500/80 uppercase tracking-wider font-bold border-b border-yellow-500/20 pb-1">배경 텍스트 (한 줄에 하나씩)</label>
                <textarea
                  value={bgTexts}
                  onChange={(e) => setBgTexts(e.target.value)}
                  rows={4}
                  className="w-full bg-white/5 border border-yellow-500/30 rounded p-2 text-white focus:outline-none focus:border-yellow-500 resize-none"
                />
                <div className="flex items-center gap-4">
                  <span className="text-xs text-gray-400 w-12">폰트</span>
                  <select 
                    value={bgTextFont} 
                    onChange={(e) => setBgTextFont(e.target.value)}
                    className="flex-1 bg-white/5 border border-yellow-500/30 rounded p-1 text-white text-sm focus:outline-none"
                    style={{ fontFamily: bgTextFont }}
                  >
                    {FONTS.map(f => <option key={f.value} value={f.value} className="bg-black" style={{ fontFamily: f.value }}>{f.label}</option>)}
                  </select>
                  <label className="flex items-center gap-1 text-xs text-gray-400 cursor-pointer">
                    <input type="checkbox" checked={bgTextBold} onChange={(e) => setBgTextBold(e.target.checked)} className="accent-yellow-500" />
                    굵게
                  </label>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-gray-400 w-12">크기</span>
                  <input
                    type="range"
                    min="0.5"
                    max="4"
                    step="0.1"
                    value={bgTextSize}
                    onChange={(e) => setBgTextSize(parseFloat(e.target.value))}
                    className="flex-1 accent-yellow-500"
                  />
                  <span className="text-xs text-gray-400 w-8 text-right">{bgTextSize}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-gray-400 w-12">속도</span>
                  <input
                    type="range"
                    min="0.1"
                    max="4"
                    step="0.1"
                    value={bgTextSpeed}
                    onChange={(e) => setBgTextSpeed(parseFloat(e.target.value))}
                    className="flex-1 accent-yellow-500"
                  />
                  <span className="text-xs text-gray-400 w-8 text-right">{bgTextSpeed}x</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-gray-400 w-12">투명도</span>
                  <input
                    type="range"
                    min="0.1"
                    max="4"
                    step="0.1"
                    value={bgTextOpacity}
                    onChange={(e) => setBgTextOpacity(parseFloat(e.target.value))}
                    className="flex-1 accent-yellow-500"
                  />
                  <span className="text-xs text-gray-400 w-8 text-right">{bgTextOpacity}x</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-gray-400 w-12">최대 개수</span>
                  <input
                    type="range"
                    min="1"
                    max="40"
                    step="1"
                    value={bgTextMaxCount}
                    onChange={(e) => setBgTextMaxCount(parseInt(e.target.value))}
                    className="flex-1 accent-yellow-500"
                  />
                  <span className="text-xs text-gray-400 w-8 text-right">{bgTextMaxCount}</span>
                </div>
              </div>

              {/* Background Effects Settings */}
              <div className="space-y-3">
                <label className="block text-sm text-yellow-500/80 uppercase tracking-wider font-bold border-b border-yellow-500/20 pb-1">배경 효과</label>
                <div className="flex flex-col gap-3 pt-2">
                  <label className="flex items-center justify-between text-sm text-gray-300 cursor-pointer">
                    <span>조명 효과 (Lights)</span>
                    <input type="checkbox" checked={showLights} onChange={(e) => setShowLights(e.target.checked)} className="accent-yellow-500 w-4 h-4" />
                  </label>
                  <label className="flex items-center justify-between text-sm text-gray-300 cursor-pointer">
                    <span>오로라 효과 (Aurora)</span>
                    <input type="checkbox" checked={showAurora} onChange={(e) => setShowAurora(e.target.checked)} className="accent-yellow-500 w-4 h-4" />
                  </label>
                  <label className="flex items-center justify-between text-sm text-gray-300 cursor-pointer">
                    <span>물결 효과 (Waves)</span>
                    <input type="checkbox" checked={showWaves} onChange={(e) => setShowWaves(e.target.checked)} className="accent-yellow-500 w-4 h-4" />
                  </label>
                  {showWaves && (
                    <div className="flex items-center gap-4 pl-2">
                      <span className="text-xs text-gray-400 w-16">물결 밝기</span>
                      <input
                        type="range"
                        min="0.1"
                        max="1"
                        step="0.1"
                        value={waveBrightness}
                        onChange={(e) => setWaveBrightness(parseFloat(e.target.value))}
                        className="flex-1 accent-yellow-500"
                      />
                      <span className="text-xs text-gray-400 w-8 text-right">{waveBrightness}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-6 border-t border-white/10">
                <button
                  onClick={handleReset}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded bg-white/5 hover:bg-white/10 text-yellow-500 transition-colors border border-yellow-500/30 tracking-widest text-sm"
                >
                  <RotateCcw size={16} />
                  기본값으로 초기화
                </button>
                <div className="text-center text-xs text-gray-600 mt-4 font-sans">
                  Made by KMC, 260329
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
