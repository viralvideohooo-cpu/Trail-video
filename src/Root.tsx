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

// Reusable Glass Card Component (Vivek / Nate Herk Style)
const GlassCard: React.FC<{
  title: string;
  subtitle: string;
  icon: string;
  delay: number;
  activeFrame: number;
}> = ({ title, subtitle, icon, delay, activeFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({
    frame: frame - delay,
    fps,
    config: { damping: 14, mass: 0.8 },
  });

  const isHighlighted = frame >= activeFrame && frame < activeFrame + 45;
  const scale = interpolate(entrance, [0, 1], [0.7, isHighlighted ? 1.05 : 1]);
  const opacity = interpolate(entrance, [0, 1], [0, 1]);
  const translateY = interpolate(entrance, [0, 1], [40, 0]);

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${translateY}px) scale(${scale})`,
        background: isHighlighted
          ? 'linear-gradient(135deg, rgba(59,130,246,0.35), rgba(147,51,234,0.35))'
          : 'rgba(255, 255, 255, 0.07)',
        border: isHighlighted
          ? '2px solid #60a5fa'
          : '1px solid rgba(255, 255, 255, 0.15)',
        boxShadow: isHighlighted
          ? '0 0 35px rgba(59, 130, 246, 0.5)'
          : '0 10px 30px rgba(0,0,0,0.4)',
        borderRadius: 24,
        padding: '22px 28px',
        display: 'flex',
        alignItems: 'center',
        gap: 22,
        marginBottom: 18,
      }}
    >
      <div
        style={{
          fontSize: 42,
          background: 'rgba(255,255,255,0.1)',
          width: 76,
          height: 76,
          borderRadius: 18,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {icon}
      </div>
      <div>
        <div style={{ color: '#ffffff', fontSize: 30, fontWeight: 800, fontFamily: 'sans-serif' }}>
          {title}
        </div>
        <div style={{ color: '#94a3b8', fontSize: 21, marginTop: 4, fontFamily: 'sans-serif' }}>
          {subtitle}
        </div>
      </div>
    </div>
  );
};

// Dynamic Subtitle Pill at Bottom
const CaptionPill: React.FC<{ text: string; highlight: string }> = ({ text, highlight }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame, fps, config: { damping: 15 } });

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 55,
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        transform: `scale(${interpolate(pop, [0, 1], [0.9, 1])})`,
      }}
    >
      <div
        style={{
          background: 'rgba(15, 23, 42, 0.92)',
          border: '2px solid rgba(96, 165, 250, 0.45)',
          padding: '16px 40px',
          borderRadius: 999,
          color: '#f8fafc',
          fontSize: 36,
          fontWeight: 700,
          fontFamily: 'sans-serif',
          boxShadow: '0 15px 40px rgba(0,0,0,0.65)',
        }}
      >
        {text}{' '}
        <span style={{ color: '#38bdf8' }}>
          {highlight}
        </span>
      </div>
    </div>
  );
};

// SCENE 1: Intro Hook (11.mp4 - Voice ON)
const Scene1: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const splitProgress = spring({
    frame: frame - 75,
    fps,
    config: { damping: 16 },
  });

  const videoWidth = interpolate(splitProgress, [0, 1], [1920, 960]);
  const videoHeight = interpolate(splitProgress, [0, 1], [1080, 740]);
  const videoLeft = interpolate(splitProgress, [0, 1], [0, 70]);
  const videoTop = interpolate(splitProgress, [0, 1], [0, 130]);
  const borderRadius = interpolate(splitProgress, [0, 1], [0, 36]);

  return (
    <AbsoluteFill style={{ background: 'radial-gradient(circle at center, #0f172a, #020617)' }}>
      <div
        style={{
          position: 'absolute',
          left: videoLeft,
          top: videoTop,
          width: videoWidth,
          height: videoHeight,
          borderRadius,
          overflow: 'hidden',
          border: splitProgress > 0.1 ? '3px solid rgba(56, 189, 248, 0.5)' : 'none',
          boxShadow: '0 25px 60px rgba(0,0,0,0.7)',
        }}
      >
        <OffthreadVideo
          src={staticFile('11.mp4')}
          startFrom={24}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>

      {frame > 75 && (
        <div
          style={{
            position: 'absolute',
            right: 75,
            top: 200,
            width: 740,
            opacity: splitProgress,
            transform: `translateX(${interpolate(splitProgress, [0, 1], [100, 0])}px)`,
          }}
        >
          <div
            style={{
              display: 'inline-block',
              background: 'rgba(56, 189, 248, 0.15)',
              color: '#38bdf8',
              padding: '10px 24px',
              borderRadius: 99,
              fontSize: 24,
              fontWeight: 800,
              fontFamily: 'sans-serif',
              marginBottom: 24,
              border: '1px solid rgba(56, 189, 248, 0.4)',
            }}
          >
            ⚡ NEXT-GEN MOBILE AI
          </div>
          <div
            style={{
              color: '#ffffff',
              fontSize: 62,
              fontWeight: 900,
              lineHeight: 1.15,
              fontFamily: 'sans-serif',
              marginBottom: 30,
            }}
          >
            Smarter Than You Think.
          </div>
          <GlassCard
            icon="🧠"
            title="Artificial Intelligence"
            subtitle="Transforming daily smartphone workflows"
            delay={85}
            activeFrame={90}
          />
        </div>
      )}

      {frame < 85 ? (
        <CaptionPill text="Your smartphone might be" highlight="smarter than you think." />
      ) : (
        <CaptionPill text="Artificial Intelligence is changing" highlight="how we use it every day." />
      )}
    </AbsoluteFill>
  );
};

// SCENE 2: 4 Feature Cards (12.mp4 - Voice ON)
const Scene2: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ background: 'radial-gradient(circle at top right, #1e1b4b, #020617)' }}>
      <div
        style={{
          position: 'absolute',
          left: 70,
          top: 130,
          width: 900,
          height: 740,
          borderRadius: 36,
          overflow: 'hidden',
          border: '3px solid rgba(168, 85, 247, 0.5)',
          boxShadow: '0 25px 60px rgba(0,0,0,0.7)',
        }}
      >
        <OffthreadVideo
          src={staticFile('12.mp4')}
          startFrom={24}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>

      <div style={{ position: 'absolute', right: 70, top: 115, width: 780 }}>
        <GlassCard
          icon="📝"
          title="1. Summarize Info"
          subtitle="Instant key takeaways from long text"
          delay={15}
          activeFrame={20}
        />
        <GlassCard
          icon="📸"
          title="2. Improve Photos"
          subtitle="Auto neural enhancement & lighting"
          delay={60}
          activeFrame={65}
        />
        <GlassCard
          icon="🌐"
          title="3. Live Translation"
          subtitle="Real-time voice & text conversations"
          delay={100}
          activeFrame={105}
        />
        <GlassCard
          icon="⚡"
          title="4. Everyday Tasks"
          subtitle="Automated routines made effortless"
          delay={145}
          activeFrame={150}
        />
      </div>

      {frame < 90 ? (
        <CaptionPill text="Summarize info &" highlight="improve photos instantly" />
      ) : (
        <CaptionPill text="Translate conversations & make" highlight="everyday tasks easier" />
      )}
    </AbsoluteFill>
  );
};

// SCENE 3: Poor Lighting Photo AI (14.mp4 - Voice ON)
const Scene3: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ background: 'radial-gradient(circle at bottom left, #064e3b, #020617)' }}>
      <div
        style={{
          position: 'absolute',
          left: 70,
          top: 130,
          width: 900,
          height: 740,
          borderRadius: 36,
          overflow: 'hidden',
          border: '3px solid rgba(16, 185, 129, 0.5)',
          boxShadow: '0 25px 60px rgba(0,0,0,0.7)',
        }}
      >
        <OffthreadVideo
          src={staticFile('14.mp4')}
          startFrom={24}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>

      <div style={{ position: 'absolute', right: 70, top: 150, width: 780 }}>
        <div
          style={{
            color: '#34d399',
            fontSize: 26,
            fontWeight: 800,
            fontFamily: 'sans-serif',
            marginBottom: 16,
            letterSpacing: 2,
          }}
        >
          AI CAMERA ENGINE
        </div>
        <GlassCard
          icon="☀️"
          title="Brighten Details"
          subtitle="Low-light night vision recovery (+85%)"
          delay={65}
          activeFrame={70}
        />
        <GlassCard
          icon="✨"
          title="Reduce Grain & Noise"
          subtitle="Multi-frame AI denoising (-92%)"
          delay={105}
          activeFrame={110}
        />
        <GlassCard
          icon="🔍"
          title="Crystal Clear Output"
          subtitle="Ultra-sharp final image reconstruction"
          delay={145}
          activeFrame={150}
        />
      </div>

      {frame < 75 ? (
        <CaptionPill text="Imagine taking a photo in" highlight="poor lighting..." />
      ) : (
        <CaptionPill text="AI brightens details, reduces noise &" highlight="makes images clearer." />
      )}
    </AbsoluteFill>
  );
};

// SCENE 4: Patterns, Info & Answers (15.mp4 - Voice ON)
const Scene4: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ background: 'radial-gradient(circle at center, #1e293b, #020617)' }}>
      <div
        style={{
          position: 'absolute',
          left: 70,
          top: 130,
          width: 900,
          height: 740,
          borderRadius: 36,
          overflow: 'hidden',
          border: '3px solid rgba(56, 189, 248, 0.5)',
          boxShadow: '0 25px 60px rgba(0,0,0,0.7)',
        }}
      >
        <OffthreadVideo
          src={staticFile('15.mp4')}
          startFrom={24}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>

      <div style={{ position: 'absolute', right: 70, top: 150, width: 780 }}>
        <div
          style={{
            color: '#38bdf8',
            fontSize: 26,
            fontWeight: 800,
            fontFamily: 'sans-serif',
            marginBottom: 16,
            letterSpacing: 2,
          }}
        >
          HOW NEURAL ENGINE WORKS
        </div>
        <GlassCard
          icon="🧩"
          title="Recognize Patterns"
          subtitle="Learns your habits & visual context"
          delay={25}
          activeFrame={30}
        />
        <GlassCard
          icon="📊"
          title="Understand Information"
          subtitle="Connects context across your apps"
          delay={70}
          activeFrame={75}
        />
        <GlassCard
          icon="💡"
          title="Useful Everyday Answers"
          subtitle="Instant solutions right when you ask"
          delay={120}
          activeFrame={125}
        />
      </div>

      {frame < 90 ? (
        <CaptionPill text="AI helps phones" highlight="recognize patterns & information" />
      ) : (
        <CaptionPill text="And provides useful answers to" highlight="everyday questions." />
      )}
    </AbsoluteFill>
  );
};

// Master Timeline (~30 Seconds Total at 30fps)
export const MainVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#020617' }}>
      <Sequence from={0} durationInFrames={210}>
        <Scene1 />
      </Sequence>
      <Sequence from={210} durationInFrames={225}>
        <Scene2 />
      </Sequence>
      <Sequence from={435} durationInFrames={225}>
        <Scene3 />
      </Sequence>
      <Sequence from={660} durationInFrames={220}>
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
        durationInFrames={880}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
