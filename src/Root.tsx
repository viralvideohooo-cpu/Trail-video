import React from 'react';
import {
  AbsoluteFill,
  Composition,
  Sequence,
  OffthreadVideo,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';

// Animated Moving Grid Background (Vivek Style)
const CyberGrid: React.FC<{ color: string }> = ({ color }) => {
  const frame = useCurrentFrame();
  const offset = (frame * 1.5) % 60;
  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#030712',
        backgroundImage: `
          radial-gradient(circle at 50% 30%, ${color}25 0%, transparent 65%),
          linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)
        `,
        backgroundSize: '100% 100%, 60px 60px, 60px 60px',
        backgroundPosition: `0 0, ${offset}px ${offset}px, ${offset}px ${offset}px`,
      }}
    />
  );
};

// Word-by-Word Pop Subtitle
constProCaption: React.FC<{ words: string[]; activeIndex: number; accent: string }> = ({
  words,
  activeIndex,
  accent,
}) => {
  return (
    <div
      style={{
        position: 'absolute',
        bottom: 50,
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        zIndex: 50,
      }}
    >
      <div
        style={{
          background: 'rgba(9, 13, 26, 0.92)',
          border: `2px solid ${accent}66`,
          padding: '16px 38px',
          borderRadius: 999,
          display: 'flex',
          gap: 14,
          boxShadow: `0 15px 45px rgba(0,0,0,0.8), 0 0 25px ${accent}33`,
        }}
      >
        {words.map((w, i) => {
          const isCurrent = i === activeIndex;
          return (
            <span
              key={i}
              style={{
                fontFamily: 'sans-serif',
                fontSize: 38,
                fontWeight: 900,
                color: isCurrent ? accent : '#f8fafc',
                transform: isCurrent ? 'scale(1.12) translateY(-3px)' : 'scale(1)',
                textShadow: isCurrent ? `0 0 20px ${accent}` : 'none',
                display: 'inline-block',
              }}
            >
              {w}
            </span>
          );
        })}
      </div>
    </div>
  );
};

// SCENE 1: Dynamic Camera Zoom + 3D Floating Glass Overlay (11.mp4)
const Scene1: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Smooth zoom-in on speaker at first, then pull back into 3D tilted card at frame 85
  const cardTransition = spring({ frame: frame - 85, fps, config: { damping: 14 } });
  const zoom = interpolate(frame, [0, 85], [1, 1.08], { extrapolateRight: 'clamp' });

  const width = interpolate(cardTransition, [0, 1], [1920, 860]);
  const height = interpolate(cardTransition, [0, 1], [1080, 680]);
  const left = interpolate(cardTransition, [0, 1], [0, 90]);
  const top = interpolate(cardTransition, [0, 1], [0, 160]);
  const rotateY = interpolate(cardTransition, [0, 1], [0, 12]);
  const radius = interpolate(cardTransition, [0, 1], [0, 40]);

  const badgePop = spring({ frame: frame - 95, fps, config: { damping: 12 } });
  const orbPulse = Math.sin(frame / 8) * 10;

  return (
    <AbsoluteFill style={{ perspective: 1400 }}>
      <CyberGrid color="#38bdf8" />

      {/* 3D Tilted Speaker Frame */}
      <div
        style={{
          position: 'absolute',
          left,
          top,
          width,
          height,
          borderRadius: radius,
          overflow: 'hidden',
          transform: `scale(${cardTransition < 0.05 ? zoom : 1}) rotateY(${rotateY}deg)`,
          border: cardTransition > 0.1 ? '3px solid #38bdf8' : 'none',
          boxShadow: cardTransition > 0.1 ? '0 30px 80px rgba(0,0,0,0.85), 0 0 40px rgba(56,189,248,0.3)' : 'none',
        }}
      >
        <OffthreadVideo
          src={staticFile('11.mp4')}
          startFrom={18}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>

      {/* Right 3D Animated AI Core Graphic */}
      {frame > 85 && (
        <div
          style={{
            position: 'absolute',
            right: 90,
            top: 170,
            width: 820,
            transform: `scale(${badgePop}) translateX(${interpolate(badgePop, [0, 1], [120, 0])}px)`,
            opacity: badgePop,
          }}
        >
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(15,23,42,0.9), rgba(30,41,59,0.7))',
              border: '2px solid rgba(56,189,248,0.5)',
              borderRadius: 36,
              padding: 48,
              boxShadow: '0 30px 70px rgba(0,0,0,0.7)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 28 }}>
              <div
                style={{
                  width: 90,
                  height: 90,
                  borderRadius: 28,
                  background: 'linear-gradient(135deg, #0284c7, #38bdf8)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 48,
                  boxShadow: `0 0 ${30 + orbPulse}px #38bdf8`,
                }}
              >
                ⚡
              </div>
              <div>
                <div style={{ color: '#38bdf8', fontSize: 22, fontWeight: 800, letterSpacing: 3, fontFamily: 'sans-serif' }}>
                  SYSTEM UPGRADE
                </div>
                <div style={{ color: '#fff', fontSize: 48, fontWeight: 900, fontFamily: 'sans-serif' }}>
                  AI Core Active
                </div>
              </div>
            </div>

            <div style={{ color: '#cbd5e1', fontSize: 28, lineHeight: 1.4, fontFamily: 'sans-serif', marginBottom: 32 }}>
              Transforming your everyday phone into a proactive neural assistant.
            </div>

            {/* Animated Neural Wave Bars */}
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end', height: 80 }}>
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((bar) => {
                const h = 25 + Math.abs(Math.sin((frame + bar * 6) / 6)) * 55;
                return (
                  <div
                    key={bar}
                    style={{
                      flex: 1,
                      height: h,
                      borderRadius: 99,
                      background: 'linear-gradient(to top, #0284c7, #38bdf8)',
                    }}
                  />
                );
              })}
            </div>
          </div>
        </div>
      )}

      {frame < 90 ? (
        <TheProCaption
          words={['Your', 'smartphone', 'is', 'SMARTER', 'than', 'you', 'think']}
          activeIndex={Math.floor(interpolate(frame, [0, 85], [0, 6], { extrapolateRight: 'clamp' }))}
          accent="#38bdf8"
        />
      ) : (
        <TheProCaption
          words={['AI', 'is', 'changing', 'how', 'we', 'use', 'it', 'EVERY', 'DAY']}
          activeIndex={Math.floor(interpolate(frame, [90, 210], [0, 8], { extrapolateRight: 'clamp' }))}
          accent="#38bdf8"
        />
      )}
    </AbsoluteFill>
  );
};

// SCENE 2: Vivek's "Blur-to-Focus" 4-Card Spotlight System (12.mp4)
const Scene2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const items = [
    { num: '01', title: 'Summarize Info', desc: 'Instant key notes', start: 20, end: 68, color: '#a855f7' },
    { num: '02', title: 'Improve Photos', desc: 'Neural HDR boost', start: 68, end: 112, color: '#ec4899' },
    { num: '03', title: 'Translate Live', desc: 'Real-time voice AI', start: 112, end: 160, color: '#3b82f6' },
    { num: '04', title: 'Everyday Tasks', desc: '10x faster workflow', start: 160, end: 245, color: '#10b981' },
  ];

  return (
    <AbsoluteFill>
      <CyberGrid color="#a855f7" />

      {/* Circular Floating Speaker Badge on Left */}
      <div
        style={{
          position: 'absolute',
          left: 80,
          top: 170,
          width: 680,
          height: 680,
          borderRadius: 48,
          overflow: 'hidden',
          border: '4px solid rgba(168,85,247,0.7)',
          boxShadow: '0 25px 70px rgba(0,0,0,0.85), 0 0 40px rgba(168,85,247,0.3)',
        }}
      >
        <OffthreadVideo
          src={staticFile('12.mp4')}
          startFrom={15}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>

      {/* Right Side: Blur-to-Focus 2x2 Grid (Vivek 00:09:18 Pattern) */}
      <div
        style={{
          position: 'absolute',
          right: 70,
          top: 165,
          width: 980,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 28,
        }}
      >
        {items.map((item, idx) => {
          const pop = spring({ frame: frame - idx * 12, fps, config: { damping: 14 } });
          const isFocused = frame >= item.start && frame < item.end;

          return (
            <div
              key={idx}
              style={{
                opacity: interpolate(pop, [0, 1], [0, isFocused ? 1 : 0.4]),
                filter: isFocused ? 'blur(0px)' : 'blur(4px)',
                transform: `scale(${isFocused ? 1.06 : 0.94})`,
                background: isFocused
                  ? `linear-gradient(135deg, ${item.color}44, rgba(15,23,42,0.95))`
                  : 'rgba(15,23,42,0.7)',
                border: isFocused ? `3px solid ${item.color}` : '1px solid rgba(255,255,255,0.1)',
                borderRadius: 32,
                padding: 36,
                boxShadow: isFocused ? `0 20px 50px ${item.color}55` : 'none',
              }}
            >
              <div
                style={{
                  color: item.color,
                  fontSize: 28,
                  fontWeight: 900,
                  fontFamily: 'sans-serif',
                  marginBottom: 12,
                }}
              >
                STEP {item.num}
              </div>
              <div style={{ color: '#fff', fontSize: 38, fontWeight: 900, fontFamily: 'sans-serif' }}>
                {item.title}
              </div>
              <div style={{ color: '#94a3b8', fontSize: 24, marginTop: 10, fontFamily: 'sans-serif' }}>
                {item.desc}
              </div>
            </div>
          );
        })}
      </div>

      <TheProCaption
        words={['Summarize,', 'Improve', 'Photos,', 'Translate', '&', 'Automate']}
        activeIndex={Math.floor(interpolate(frame, [15, 220], [0, 5], { extrapolateRight: 'clamp' }))}
        accent="#c084fc"
      />
    </AbsoluteFill>
  );
};

// SCENE 3: Live Animated Metering Bars + Camera HUD (14.mp4)
const Scene3: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const meters = [
    { label: 'BRIGHTEN DETAILS', val: 88, start: 75, color: '#34d399' },
    { label: 'NOISE REDUCTION', val: 94, start: 120, color: '#38bdf8' },
    { label: 'CLARITY & SHARPNESS', val: 99, start: 165, color: '#facc15' },
  ];

  return (
    <AbsoluteFill>
      <CyberGrid color="#10b981" />

      <div
        style={{
          position: 'absolute',
          left: 80,
          top: 150,
          width: 820,
          height: 720,
          borderRadius: 40,
          overflow: 'hidden',
          border: '3px solid #10b981',
          boxShadow: '0 25px 70px rgba(0,0,0,0.85)',
        }}
      >
        <OffthreadVideo
          src={staticFile('14.mp4')}
          startFrom={15}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>

      {/* Right Side Animated Progress Meters */}
      <div style={{ position: 'absolute', right: 80, top: 170, width: 840 }}>
        <div style={{ color: '#10b981', fontSize: 24, fontWeight: 900, letterSpacing: 3, fontFamily: 'sans-serif' }}>
          LOW-LIGHT NEURAL ENGINE
        </div>
        <div style={{ color: '#fff', fontSize: 54, fontWeight: 900, fontFamily: 'sans-serif', marginBottom: 36 }}>
          Real-Time Image Fix
        </div>

        {meters.map((m, i) => {
          const prog = spring({ frame: frame - m.start, fps, config: { damping: 18 } });
          const currentNum = Math.round(interpolate(prog, [0, 1], [0, m.val]));

          return (
            <div
              key={i}
              style={{
                background: 'rgba(15,23,42,0.85)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: 28,
                padding: '28px 34px',
                marginBottom: 24,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <span style={{ color: '#f8fafc', fontSize: 28, fontWeight: 800, fontFamily: 'sans-serif' }}>
                  {m.label}
                </span>
                <span style={{ color: m.color, fontSize: 32, fontWeight: 900, fontFamily: 'sans-serif' }}>
                  +{currentNum}%
                </span>
              </div>
              <div style={{ width: '100%', height: 20, background: '#1e293b', borderRadius: 99, overflow: 'hidden' }}>
                <div
                  style={{
                    width: `${currentNum}%`,
                    height: '100%',
                    background: m.color,
                    borderRadius: 99,
                    boxShadow: `0 0 20px ${m.color}`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <TheProCaption
        words={['Brighten', 'Details,', 'Reduce', 'Noise', '&', 'Boost', 'Clarity']}
        activeIndex={Math.floor(interpolate(frame, [60, 225], [0, 6], { extrapolateRight: 'clamp' }))}
        accent="#34d399"
      />
    </AbsoluteFill>
  );
};

// SCENE 4: Vivek's "Second Brain" Connected Node Flow (15.mp4)
const Scene4: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const line1 = spring({ frame: frame - 65, fps, config: { damping: 20 } });
  const line2 = spring({ frame: frame - 125, fps, config: { damping: 20 } });

  const nodes = [
    { title: 'Recognize Patterns', sub: 'Visual & habit scan', frameStart: 20, color: '#38bdf8' },
    { title: 'Understand Context', sub: 'Deep neural linking', frameStart: 75, color: '#818cf8' },
    { title: 'Instant Answers', sub: 'Everyday solutions', frameStart: 135, color: '#f472b6' },
  ];

  return (
    <AbsoluteFill>
      <CyberGrid color="#6366f1" />

      {/* Top Center Speaker PIP Banner */}
      <div
        style={{
          position: 'absolute',
          top: 60,
          left: 710,
          width: 500,
          height: 320,
          borderRadius: 32,
          overflow: 'hidden',
          border: '3px solid #818cf8',
          boxShadow: '0 20px 60px rgba(0,0,0,0.8)',
        }}
      >
        <OffthreadVideo
          src={staticFile('15.mp4')}
          startFrom={15}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>

      {/* Bottom Full-Width Connected Node Pipeline (Vivek 00:10:07 Pattern) */}
      <div
        style={{
          position: 'absolute',
          top: 470,
          left: 100,
          right: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {nodes.map((n, i) => {
          const pop = spring({ frame: frame - n.frameStart, fps, config: { damping: 13 } });
          return (
            <React.Fragment key={i}>
              <div
                style={{
                  width: 460,
                  padding: 36,
                  borderRadius: 32,
                  background: 'rgba(15,23,42,0.92)',
                  border: `3px solid ${n.color}`,
                  boxShadow: `0 0 40px ${n.color}44`,
                  transform: `scale(${pop})`,
                  opacity: pop,
                  textAlign: 'center',
                }}
              >
                <div style={{ color: n.color, fontSize: 22, fontWeight: 900, marginBottom: 10, fontFamily: 'sans-serif' }}>
                  STAGE 0{i + 1}
                </div>
                <div style={{ color: '#fff', fontSize: 34, fontWeight: 900, fontFamily: 'sans-serif' }}>
                  {n.title}
                </div>
                <div style={{ color: '#94a3b8', fontSize: 22, marginTop: 8, fontFamily: 'sans-serif' }}>
                  {n.sub}
                </div>
              </div>

              {i < 2 && (
                <div style={{ flex: 1, height: 8, background: '#1e293b', margin: '0 20px', borderRadius: 99 }}>
                  <div
                    style={{
                      width: `${(i === 0 ? line1 : line2) * 100}%`,
                      height: '100%',
                      background: 'linear-gradient(90deg, #38bdf8, #f472b6)',
                      borderRadius: 99,
                      boxShadow: '0 0 20px #818cf8',
                    }}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      <TheProCaption
        words={['Recognize', 'Patterns', '➔', 'Understand', 'Info', '➔', 'Useful', 'Answers']}
        activeIndex={Math.floor(interpolate(frame, [20, 220], [0, 7], { extrapolateRight: 'clamp' }))}
        accent="#818cf8"
      />
    </AbsoluteFill>
  );
};

const TheProCaption = constProCaption;

// Master Timeline (Extended scene durations so NO words get cut off!)
export const MainVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#030712' }}>
      <Sequence from={0} durationInFrames={240}>
        <Scene1 />
      </Sequence>
      <Sequence from={240} durationInFrames={255}>
        <Scene2 />
      </Sequence>
      <Sequence from={495} durationInFrames={255}>
        <Scene3 />
      </Sequence>
      <Sequence from={750} durationInFrames={255}>
        <Scene4 />
      </Sequence>
    </AbsoluteFill>
  );
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="HelloWorld"
        component={MainVideo}
        durationInFrames={1005}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
