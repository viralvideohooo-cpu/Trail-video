import React from 'react';
import {
  AbsoluteFill,
  Composition,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';

const DroneSatelliteView: React.FC<{
  zoomStart: number;
  zoomEnd: number;
  rotateStart: number;
  rotateEnd: number;
  pitch?: number;
  tileOffsetX?: number;
  tileOffsetY?: number;
}> = ({
  zoomStart,
  zoomEnd,
  rotateStart,
  rotateEnd,
  pitch = 48,
  tileOffsetX = 0,
  tileOffsetY = 0,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const scale = interpolate(frame, [0, durationInFrames], [zoomStart, zoomEnd], {
    extrapolateRight: 'clamp',
  });
  const rotateZ = interpolate(frame, [0, durationInFrames], [rotateStart, rotateEnd], {
    extrapolateRight: 'clamp',
  });

  const baseTileX = 186220 + tileOffsetX;
  const baseTileY = 110682 + tileOffsetY;
  const grid = [-2, -1, 0, 1, 2];

  return (
    <AbsoluteFill style={{ backgroundColor: '#1a2418', overflow: 'hidden', perspective: 1200 }}>
      <div
        style={{
          position: 'absolute',
          width: 2560,
          height: 2560,
          left: '50%',
          top: '50%',
          marginLeft: -1280,
          marginTop: -1280,
          transform: `rotateX(${pitch}deg) rotateZ(${rotateZ}deg) scale(${scale})`,
          transformStyle: 'preserve-3d',
          filter: 'contrast(1.18) saturate(1.25) brightness(0.95)',
        }}
      >
        {grid.map((dy) =>
          grid.map((dx) => (
            <img
              key={`${dx}-${dy}`}
              src={`https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/18/${
                baseTileY + dy
              }/${baseTileX + dx}`}
              style={{
                position: 'absolute',
                left: (dx + 2) * 512,
                top: (dy + 2) * 512,
                width: 513,
                height: 513,
                objectFit: 'cover',
              }}
            />
          ))
        )}
      </div>
      <AbsoluteFill
        style={{
          background: 'radial-gradient(circle at center, transparent 55%, rgba(0,0,0,0.55) 100%)',
        }}
      />
    </AbsoluteFill>
  );
};

const Isometric3DText: React.FC<{
  lines: string[];
  fontSize?: number;
  rotateZ?: number;
  rotateX?: number;
  top?: number;
  left?: number;
  accentLineIndex?: number;
  accentColor?: string;
}> = ({
  lines,
  fontSize = 105,
  rotateZ = -28,
  rotateX = 35,
  top = 680,
  left = 140,
  accentLineIndex = -1,
  accentColor = '#facc15',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame: frame - 8, fps, config: { damping: 12, mass: 0.9 } });

  return (
    <div
      style={{
        position: 'absolute',
        top,
        left,
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateZ(${rotateZ}deg) scale(${pop})`,
        zIndex: 30,
      }}
    >
      {lines.map((line, idx) => (
        <div
          key={idx}
          style={{
            fontFamily: 'Impact, Arial Black, sans-serif',
            fontSize,
            fontWeight: 900,
            lineHeight: 1.02,
            color: idx === accentLineIndex ? accentColor : '#ffffff',
            textAlign: 'center',
            letterSpacing: -1,
            textShadow:
              '0 2px 0 #cbd5e1, 0 4px 0 #94a3b8, 0 6px 0 #64748b, 0 8px 0 #475569, 0 10px 0 #1e293b, 0 18px 30px rgba(0,0,0,0.85)',
          }}
        >
          {line}
        </div>
      ))}
    </div>
  );
};

const GlowingPropertyPolygon: React.FC<{
  scale?: number;
  rotateZ?: number;
  showRoofNumbers?: boolean;
  borderOnlyFirst?: boolean;
}> = ({ scale = 1, rotateZ = -28, showRoofNumbers = false, borderOnlyFirst = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame: frame - 5, fps, config: { damping: 14 } });
  const fillOpacity = borderOnlyFirst
    ? interpolate(frame, [12, 28], [0, 0.58], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    : interpolate(pop, [0, 1], [0, 0.58]);
  const num1Pop = spring({ frame: frame - 40, fps, config: { damping: 11 } });
  const num2Pop = spring({ frame: frame - 55, fps, config: { damping: 11 } });

  return (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: '52%',
        width: 680,
        height: 460,
        marginLeft: -340,
        marginTop: -230,
        transform: `perspective(1000px) rotateX(45deg) rotateZ(${rotateZ}deg) scale(${scale * pop})`,
        zIndex: 15,
      }}
    >
      <svg width="680" height="460" viewBox="0 0 680 460" style={{ overflow: 'visible' }}>
        <polygon
          points="70,120 470,120 470,220 610,220 610,390 470,440 70,340 70,190"
          fill={`rgba(234, 255, 0, ${fillOpacity * 0.75})`}
          stroke="#ffffff"
          strokeWidth="4"
        />
        <polygon
          points="70,60 470,60 470,160 610,160 610,330 70,330"
          fill={`rgba(238, 255, 20, ${fillOpacity})`}
          stroke="#ffffff"
          strokeWidth="8"
        />
      </svg>
      {showRoofNumbers && (
        <>
          <div
            style={{
              position: 'absolute',
              left: 145,
              top: 95,
              transform: `scale(${num1Pop}) rotateZ(15deg)`,
              fontFamily: 'Impact, sans-serif',
              fontSize: 165,
              fontWeight: 900,
              color: '#2563eb',
              textShadow: '0 8px 0 #1e3a8a, 0 14px 25px rgba(0,0,0,0.7)',
            }}
          >
            1
          </div>
          <div
            style={{
              position: 'absolute',
              left: 365,
              top: 125,
              transform: `scale(${num2Pop}) rotateZ(15deg)`,
              fontFamily: 'Impact, sans-serif',
              fontSize: 165,
              fontWeight: 900,
              color: '#2563eb',
              textShadow: '0 8px 0 #1e3a8a, 0 14px 25px rgba(0,0,0,0.7)',
            }}
          >
            2
          </div>
        </>
      )}
    </div>
  );
};

const PropertyHeaderBadge: React.FC<{ subtitle: string }> = ({ subtitle }) => (
  <div
    style={{
      position: 'absolute',
      top: 70,
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      zIndex: 50,
    }}
  >
    <div
      style={{
        background: 'rgba(15, 23, 42, 0.88)',
        border: '2px solid rgba(250, 204, 21, 0.7)',
        padding: '12px 32px',
        borderRadius: 999,
        color: '#facc15',
        fontSize: 28,
        fontWeight: 900,
        fontFamily: 'sans-serif',
        letterSpacing: 2,
        boxShadow: '0 10px 30px rgba(0,0,0,0.7)',
      }}
    >
      📍 HOTEL TANWAR • JHOTWARA, JAIPUR
    </div>
    <div
      style={{
        marginTop: 10,
        color: '#ffffff',
        fontSize: 24,
        fontWeight: 700,
        fontFamily: 'sans-serif',
        textShadow: '0 2px 10px rgba(0,0,0,0.9)',
      }}
    >
      {subtitle}
    </div>
  </div>
);

const Scene1: React.FC = () => (
  <AbsoluteFill>
    <DroneSatelliteView zoomStart={1.35} zoomEnd={1.55} rotateStart={-12} rotateEnd={-22} />
    <PropertyHeaderBadge subtitle="Plot No. 80, 6-A, Ganesh Nagar, Benad Rd" />
    <GlowingPropertyPolygon scale={1.15} rotateZ={-32} />
    <Isometric3DText lines={['Plot No. 80']} fontSize={110} rotateZ={-32} top={760} left={210} />
  </AbsoluteFill>
);

const Scene2: React.FC = () => (
  <AbsoluteFill>
    <DroneSatelliteView zoomStart={1.15} zoomEnd={0.95} rotateStart={-22} rotateEnd={-8} />
    <PropertyHeaderBadge subtitle="Luxury Stay & Marriage Garden" />
    <GlowingPropertyPolygon scale={0.85} rotateZ={-18} />
    <Isometric3DText lines={['20', 'Rooms']} fontSize={130} rotateZ={-18} top={530} left={280} />
  </AbsoluteFill>
);

const Scene3: React.FC = () => (
  <AbsoluteFill>
    <DroneSatelliteView zoomStart={0.95} zoomEnd={1.1} rotateStart={10} rotateEnd={22} />
    <PropertyHeaderBadge subtitle="Tanwar Vivah Garden • Open 24 Hours" />
    <GlowingPropertyPolygon scale={0.82} rotateZ={-20} borderOnlyFirst />
    <Isometric3DText
      lines={['20 Rooms', '+ 2 Big', 'Banquet Halls']}
      accentLineIndex={1}
      fontSize={96}
      rotateZ={-20}
      top={440}
      left={160}
    />
  </AbsoluteFill>
);

const Scene4: React.FC = () => {
  const frame = useCurrentFrame();
  const wide = frame > 195;
  return (
    <AbsoluteFill>
      <DroneSatelliteView
        zoomStart={wide ? 0.78 : 1.25}
        zoomEnd={wide ? 0.62 : 1.05}
        rotateStart={wide ? 5 : -15}
        rotateEnd={wide ? 18 : 0}
        pitch={wide ? 58 : 44}
      />
      <PropertyHeaderBadge
        subtitle={
          wide ? 'Prime Connectivity • Shankar Vihar Ext.' : 'Dual Hall Setup: Hall 1 & Hall 2'
        }
      />
      <GlowingPropertyPolygon
        scale={wide ? 0.45 : 1.05}
        rotateZ={-15}
        showRoofNumbers={!wide}
      />
    </AbsoluteFill>
  );
};

const Scene5: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const roadSlide = spring({ frame: frame - 15, fps, config: { damping: 16 } });
  const facingPop = spring({ frame: frame - 55, fps, config: { damping: 12 } });
  return (
    <AbsoluteFill>
      <DroneSatelliteView zoomStart={1.15} zoomEnd={1.28} rotateStart={-10} rotateEnd={-4} />
      <PropertyHeaderBadge subtitle="Direct Access from Main Benad Road" />
      <div
        style={{
          position: 'absolute',
          left: -120,
          top: 980,
          width: interpolate(roadSlide, [0, 1], [0, 1150]),
          height: 150,
          background: 'linear-gradient(90deg, rgba(37,99,235,0.92), rgba(59,130,246,0.82))',
          borderTop: '5px solid #93c5fd',
          borderBottom: '5px solid #93c5fd',
          boxShadow: '0 0 45px rgba(37,99,235,0.9)',
          transform: 'perspective(900px) rotateX(42deg) rotateZ(34deg)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          zIndex: 25,
        }}
      >
        <span
          style={{
            color: '#ffffff',
            fontFamily: 'Impact, sans-serif',
            fontSize: 78,
            fontWeight: 900,
            letterSpacing: 3,
            whiteSpace: 'nowrap',
          }}
        >
          MAIN BENAD ROAD
        </span>
      </div>
      <GlowingPropertyPolygon scale={0.9} rotateZ={-24} />
      {frame > 50 && (
        <div
          style={{
            position: 'absolute',
            left: 330,
            top: 690,
            transform: `perspective(900px) rotateX(40deg) rotateZ(-24deg) scale(${facingPop})`,
            zIndex: 35,
          }}
        >
          <div
            style={{
              color: '#ffffff',
              fontFamily: 'Impact, sans-serif',
              fontSize: 82,
              textShadow: '0 6px 0 #334155, 0 12px 20px rgba(0,0,0,0.85)',
            }}
          >
            West
          </div>
          <div
            style={{
              color: '#facc15',
              fontFamily: 'Impact, sans-serif',
              fontSize: 92,
              marginTop: 20,
              marginLeft: 90,
              textShadow: '0 6px 0 #334155, 0 12px 20px rgba(0,0,0,0.85)',
            }}
          >
            North
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};

const Scene6: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pinDrop = spring({ frame: frame - 10, fps, config: { damping: 10, mass: 0.9 } });
  const p1 = (frame % 45) / 45;
  const p2 = ((frame + 22) % 45) / 45;
  return (
    <AbsoluteFill>
      <DroneSatelliteView
        zoomStart={1.05}
        zoomEnd={1.25}
        rotateStart={8}
        rotateEnd={16}
        tileOffsetX={1}
        tileOffsetY={-1}
      />
      <PropertyHeaderBadge subtitle="800m to Mahadev & Metro City Hospital" />
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '48%',
          width: 420,
          height: 420,
          marginLeft: -210,
          marginTop: -210,
          transform: 'rotateX(55deg)',
          zIndex: 20,
        }}
      >
        {[p1, p2].map((p, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '50%',
              border: '8px solid #a3e635',
              background: 'rgba(163, 230, 53, 0.22)',
              transform: `scale(${0.2 + p * 1.1})`,
              opacity: 1 - p,
              boxShadow: '0 0 30px #84cc16',
            }}
          />
        ))}
      </div>
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '34%',
          marginLeft: -85,
          transform: `translateY(${interpolate(pinDrop, [0, 1], [-300, 0])}px) scale(${pinDrop})`,
          zIndex: 30,
          filter: 'drop-shadow(0 25px 25px rgba(0,0,0,0.85))',
        }}
      >
        <svg width="170" height="220" viewBox="0 0 170 220">
          <path
            d="M85 0C38 0 0 38 0 85c0 63 85 135 85 135s85-72 85-135C170 38 132 0 85 0z"
            fill="#ef4444"
          />
          <circle cx="85" cy="82" r="34" fill="#7f1d1d" />
        </svg>
      </div>
      <div
        style={{
          position: 'absolute',
          top: 980,
          width: '100%',
          textAlign: 'center',
          transform: `rotateZ(-12deg) scale(${pinDrop})`,
          zIndex: 35,
          fontFamily: 'Georgia, serif',
          fontStyle: 'italic',
          fontWeight: 900,
          fontSize: 105,
          lineHeight: 0.98,
          color: '#ffffff',
          textShadow: '0 8px 0 #1e293b, 0 18px 35px rgba(0,0,0,0.95)',
        }}
      >
        Mahadev & Metro
        <br />
        Hospital
      </div>
    </AbsoluteFill>
  );
};

const Scene7: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const speedRamp = spring({ frame, fps, config: { damping: 14, mass: 0.6 } });
  const blur = interpolate(frame, [0, 12], [18, 0], { extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill style={{ filter: `blur(${blur}px)` }}>
      <DroneSatelliteView
        zoomStart={2.4}
        zoomEnd={1.25}
        rotateStart={-25}
        rotateEnd={0}
        pitch={35}
        tileOffsetX={-1}
        tileOffsetY={1}
      />
      <PropertyHeaderBadge subtitle="1 Min from Nadi Ka Phatak & Benad Rd" />
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '44%',
          width: 280,
          height: 280,
          marginLeft: -140,
          marginTop: -140,
          borderRadius: '50%',
          border: '6px solid rgba(250, 204, 21, 0.85)',
          boxShadow: '0 0 60px rgba(250, 204, 21, 0.6)',
          transform: `scale(${speedRamp})`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 1120,
          width: '100%',
          textAlign: 'center',
          transform: `perspective(800px) rotateX(28deg) scale(${speedRamp})`,
          zIndex: 35,
        }}
      >
        <div
          style={{
            fontFamily: 'Impact, sans-serif',
            fontSize: 98,
            fontWeight: 900,
            lineHeight: 0.96,
            color: '#f1f5f9',
            letterSpacing: 3,
            textShadow: '0 8px 0 #0f172a, 0 20px 40px rgba(0,0,0,0.9)',
          }}
        >
          NADI KA PHATAK
          <br />
          JHOTWARA CIRCLE
        </div>
        <div
          style={{
            marginTop: 28,
            display: 'inline-block',
            background: '#facc15',
            color: '#0f172a',
            fontFamily: 'sans-serif',
            fontSize: 34,
            fontWeight: 900,
            padding: '12px 36px',
            borderRadius: 99,
            boxShadow: '0 10px 30px rgba(0,0,0,0.8)',
          }}
        >
          HOTEL TANWAR • 20 ROOMS + 2 BIG HALLS
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const MainVideo: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: '#0f172a' }}>
    <Sequence from={0} durationInFrames={90}>
      <Scene1 />
    </Sequence>
    <Sequence from={90} durationInFrames={90}>
      <Scene2 />
    </Sequence>
    <Sequence from={180} durationInFrames={120}>
      <Scene3 />
    </Sequence>
    <Sequence from={300} durationInFrames={300}>
      <Scene4 />
    </Sequence>
    <Sequence from={600} durationInFrames={150}>
      <Scene5 />
    </Sequence>
    <Sequence from={750} durationInFrames={90}>
      <Scene6 />
    </Sequence>
    <Sequence from={840} durationInFrames={150}>
      <Scene7 />
    </Sequence>
  </AbsoluteFill>
);

export const RemotionRoot: React.FC = () => (
  <Composition
    id="HelloWorld"
    component={MainVideo}
    durationInFrames={990}
    fps={30}
    width={1080}
    height={1920}
  />
);
