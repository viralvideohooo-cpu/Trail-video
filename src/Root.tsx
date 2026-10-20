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

// Precise Satellite View locked onto Hotel Tanwar & Benad Road, Jhotwara, Jaipur
const DroneSatelliteView: React.FC<{
  zoomStart: number;
  zoomEnd: number;
  rotateStart: number;
  rotateEnd: number;
  pitch?: number;
  offsetX?: number;
  offsetY?: number;
}> = ({
  zoomStart,
  zoomEnd,
  rotateStart,
  rotateEnd,
  pitch = 46,
  offsetX = 0,
  offsetY = 0,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const scale = interpolate(frame, [0, durationInFrames], [zoomStart, zoomEnd], {
    extrapolateRight: 'clamp',
  });
  const rotateZ = interpolate(frame, [0, durationInFrames], [rotateStart, rotateEnd], {
    extrapolateRight: 'clamp',
  });

  // Exact Esri Tile coordinates centered on Hotel Tanwar, Benad Road, Jaipur
  const tileX = 186220 + offsetX;
  const tileY = 110682 + offsetY;
  const grid = [-2, -1, 0, 1, 2];

  return (
    <AbsoluteFill style={{ backgroundColor: '#0f172a', overflow: 'hidden', perspective: 1200 }}>
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
          filter: 'contrast(1.2) saturate(1.3) brightness(0.96)',
        }}
      >
        {grid.map((dy) =>
          grid.map((dx) => (
            <img
              key={`${dx}-${dy}`}
              src={`https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/18/${
                tileY + dy
              }/${tileX + dx}`}
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
          background: 'radial-gradient(circle at center, transparent 50%, rgba(0,0,0,0.65) 100%)',
          pointerEvents: 'none',
        }}
      />
    </AbsoluteFill>
  );
};

// 3D Isometric Extruded White Text (Reference Video Style)
const Isometric3DText: React.FC<{
  lines: string[];
  fontSize?: number;
  rotateZ?: number;
  top?: number;
  left?: number;
  accentLineIndex?: number;
}> = ({ lines, fontSize = 110, rotateZ = -26, top = 650, left = 140, accentLineIndex = -1 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame: frame - 6, fps, config: { damping: 12, mass: 0.9 } });

  return (
    <div
      style={{
        position: 'absolute',
        top,
        left,
        transform: `perspective(1000px) rotateX(36deg) rotateZ(${rotateZ}deg) scale(${pop})`,
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
            color: idx === accentLineIndex ? '#facc15' : '#ffffff',
            textAlign: 'center',
            letterSpacing: -1,
            textShadow:
              '0 2px 0 #cbd5e1, 0 4px 0 #94a3b8, 0 6px 0 #64748b, 0 8px 0 #475569, 0 10px 0 #1e293b, 0 20px 35px rgba(0,0,0,0.9)',
          }}
        >
          {line}
        </div>
      ))}
    </div>
  );
};

// Precise Neon-Yellow Building Polygon locked onto Hotel Tanwar
const GlowingBuildingPolygon: React.FC<{
  scale?: number;
  rotateZ?: number;
  showRoofNumbers?: boolean;
  borderOnly?: boolean;
}> = ({ scale = 1, rotateZ = -26, showRoofNumbers = false, borderOnly = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame: frame - 4, fps, config: { damping: 14 } });
  const fillOpacity = borderOnly
    ? interpolate(frame, [10, 25], [0, 0.6], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    : interpolate(pop, [0, 1], [0, 0.6]);

  const n1 = spring({ frame: frame - 35, fps, config: { damping: 11 } });
  const n2 = spring({ frame: frame - 48, fps, config: { damping: 11 } });

  return (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: '49%',
        width: 620,
        height: 420,
        marginLeft: -310,
        marginTop: -210,
        transform: `perspective(1000px) rotateX(46deg) rotateZ(${rotateZ}deg) scale(${scale * pop})`,
        zIndex: 15,
      }}
    >
      <svg width="620" height="420" viewBox="0 0 620 420" style={{ overflow: 'visible' }}>
        <polygon
          points="60,100 440,100 440,200 560,200 560,360 440,400 60,320 60,170"
          fill={`rgba(234, 255, 0, ${fillOpacity * 0.7})`}
          stroke="#ffffff"
          strokeWidth="4"
        />
        <polygon
          points="60,50 440,50 440,150 560,150 560,310 60,310"
          fill={`rgba(238, 255, 20, ${fillOpacity})`}
          stroke="#ffffff"
          strokeWidth="7"
        />
      </svg>
      {showRoofNumbers && (
        <>
          <div
            style={{
              position: 'absolute',
              left: 130,
              top: 80,
              transform: `scale(${n1}) rotateZ(15deg)`,
              fontFamily: 'Impact, sans-serif',
              fontSize: 155,
              fontWeight: 900,
              color: '#2563eb',
              textShadow: '0 8px 0 #1e3a8a, 0 14px 25px rgba(0,0,0,0.8)',
            }}
          >
            1
          </div>
          <div
            style={{
              position: 'absolute',
              left: 330,
              top: 110,
              transform: `scale(${n2}) rotateZ(15deg)`,
              fontFamily: 'Impact, sans-serif',
              fontSize: 155,
              fontWeight: 900,
              color: '#2563eb',
              textShadow: '0 8px 0 #1e3a8a, 0 14px 25px rgba(0,0,0,0.8)',
            }}
          >
            2
          </div>
        </>
      )}
    </div>
  );
};

const HeaderBadge: React.FC<{ subtitle: string }> = ({ subtitle }) => (
  <div
    style={{
      position: 'absolute',
      top: 65,
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      zIndex: 50,
    }}
  >
    <div
      style={{
        background: 'rgba(15, 23, 42, 0.9)',
        border: '2px solid rgba(250, 204, 21, 0.75)',
        padding: '12px 34px',
        borderRadius: 999,
        color: '#facc15',
        fontSize: 27,
        fontWeight: 900,
        fontFamily: 'sans-serif',
        letterSpacing: 2,
        boxShadow: '0 10px 30px rgba(0,0,0,0.8)',
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
        textShadow: '0 2px 10px rgba(0,0,0,0.95)',
      }}
    >
      {subtitle}
    </div>
  </div>
);

// SCENE 1 (0-3s): Plot No. 80
const Scene1: React.FC = () => (
  <AbsoluteFill>
    <DroneSatelliteView zoomStart={1.35} zoomEnd={1.5} rotateStart={-10} rotateEnd={-20} />
    <HeaderBadge subtitle="Plot No. 80, 6-A, Ganesh Nagar, Benad Rd" />
    <GlowingBuildingPolygon scale={1.1} rotateZ={-28} />
    <Isometric3DText lines={['Plot No. 80']} fontSize={115} rotateZ={-28} top={740} left={220} />
  </AbsoluteFill>
);

// SCENE 2 (3-6s): 20 Rooms
const Scene2: React.FC = () => (
  <AbsoluteFill>
    <DroneSatelliteView zoomStart={1.15} zoomEnd={0.98} rotateStart={-20} rotateEnd={-8} />
    <HeaderBadge subtitle="Luxury Stay & Marriage Garden" />
    <GlowingBuildingPolygon scale={0.88} rotateZ={-16} />
    <Isometric3DText lines={['20', 'Rooms']} fontSize={135} rotateZ={-16} top={510} left={300} />
  </AbsoluteFill>
);

// SCENE 3 (6-10s): 20 Rooms + 2 Big Banquet Halls
const Scene3: React.FC = () => (
  <AbsoluteFill>
    <DroneSatelliteView zoomStart={0.98} zoomEnd={1.12} rotateStart={8} rotateEnd={20} />
    <HeaderBadge subtitle="Tanwar Vivah Garden • Open 24 Hours" />
    <GlowingBuildingPolygon scale={0.85} rotateZ={-18} borderOnly />
    <Isometric3DText
      lines={['20 Rooms', '+ 2 Big', 'Banquet Halls']}
      accentLineIndex={1}
      fontSize={98}
      rotateZ={-18}
      top={420}
      left={170}
    />
  </AbsoluteFill>
);

// SCENE 4 (10-18s): Hall 1 & Hall 2 (Roof Numbers)
const Scene4: React.FC = () => {
  const frame = useCurrentFrame();
  const wide = frame > 195;
  return (
    <AbsoluteFill>
      <DroneSatelliteView
        zoomStart={wide ? 0.78 : 1.22}
        zoomEnd={wide ? 0.62 : 1.05}
        rotateStart={wide ? 5 : -14}
        rotateEnd={wide ? 16 : 0}
        pitch={wide ? 56 : 44}
      />
      <HeaderBadge
        subtitle={
          wide ? 'Prime Connectivity • Shankar Vihar Ext.' : 'Dual Hall Setup: Hall 1 & Hall 2'
        }
      />
      <GlowingBuildingPolygon
        scale={wide ? 0.45 : 1.05}
        rotateZ={-14}
        showRoofNumbers={!wide}
      />
    </AbsoluteFill>
  );
};

// SCENE 5 (18-25s): Main Benad Road & North/West Facing
const Scene5: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const roadSlide = spring({ frame: frame - 12, fps, config: { damping: 16 } });
  const facingPop = spring({ frame: frame - 50, fps, config: { damping: 12 } });

  return (
    <AbsoluteFill>
      <DroneSatelliteView zoomStart={1.15} zoomEnd={1.25} rotateStart={-8} rotateEnd={-2} />
      <HeaderBadge subtitle="Direct Access from Main Benad Road" />
      {/* Blue Benad Road Strip perfectly aligned with front road */}
      <div
        style={{
          position: 'absolute',
          left: -100,
          top: 960,
          width: interpolate(roadSlide, [0, 1], [0, 1120]),
          height: 145,
          background: 'linear-gradient(90deg, rgba(37,99,235,0.95), rgba(59,130,246,0.85))',
          borderTop: '5px solid #93c5fd',
          borderBottom: '5px solid #93c5fd',
          boxShadow: '0 0 50px rgba(37,99,235,0.95)',
          transform: 'perspective(900px) rotateX(42deg) rotateZ(32deg)',
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
            fontSize: 76,
            fontWeight: 900,
            letterSpacing: 3,
            whiteSpace: 'nowrap',
          }}
        >
          MAIN BENAD ROAD
        </span>
      </div>
      <GlowingBuildingPolygon scale={0.92} rotateZ={-22} />
      {frame > 45 && (
        <div
          style={{
            position: 'absolute',
            left: 340,
            top: 670,
            transform: `perspective(900px) rotateX(40deg) rotateZ(-22deg) scale(${facingPop})`,
            zIndex: 35,
          }}
        >
          <div
            style={{
              color: '#ffffff',
              fontFamily: 'Impact, sans-serif',
              fontSize: 84,
              textShadow: '0 6px 0 #334155, 0 12px 20px rgba(0,0,0,0.85)',
            }}
          >
            West
          </div>
          <div
            style={{
              color: '#facc15',
              fontFamily: 'Impact, sans-serif',
              fontSize: 94,
              marginTop: 18,
              marginLeft: 85,
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

// SCENE 6 (25-28s): Mahadev & Metro City Hospital Pin
const Scene6: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pinDrop = spring({ frame: frame - 8, fps, config: { damping: 10, mass: 0.9 } });
  const p1 = (frame % 45) / 45;
  const p2 = ((frame + 22) % 45) / 45;

  return (
    <AbsoluteFill>
      <DroneSatelliteView zoomStart={1.05} zoomEnd={1.22} rotateStart={6} rotateEnd={14} offsetX={1} offsetY={-1} />
      <HeaderBadge subtitle="800m to Mahadev & Metro City Hospital" />
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '47%',
          width: 400,
          height: 400,
          marginLeft: -200,
          marginTop: -200,
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
          top: '33%',
          marginLeft: -85,
          transform: `translateY(${interpolate(pinDrop, [0, 1], [-300, 0])}px) scale(${pinDrop})`,
          zIndex: 30,
          filter: 'drop-shadow(0 25px 25px rgba(0,0,0,0.9))',
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
          top: 960,
          width: '100%',
          textAlign: 'center',
          transform: `rotateZ(-10deg) scale(${pinDrop})`,
          zIndex: 35,
          fontFamily: 'Georgia, serif',
          fontStyle: 'italic',
          fontWeight: 900,
          fontSize: 102,
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

// SCENE 7 (28-33s): Nadi Ka Phatak Jhotwara Circle (Speed Ramp Zoom)
const Scene7: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const speedRamp = spring({ frame, fps, config: { damping: 14, mass: 0.6 } });
  const blur = interpolate(frame, [0, 10], [16, 0], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ filter: `blur(${blur}px)` }}>
      <DroneSatelliteView zoomStart={2.3} zoomEnd={1.2} rotateStart={-20} rotateEnd={0} pitch={34} offsetX={-1} offsetY={1} />
      <HeaderBadge subtitle="1 Min from Nadi Ka Phatak & Benad Rd" />
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '43%',
          width: 270,
          height: 270,
          marginLeft: -135,
          marginTop: -135,
          borderRadius: '50%',
          border: '6px solid rgba(250, 204, 21, 0.9)',
          boxShadow: '0 0 65px rgba(250, 204, 21, 0.65)',
          transform: `scale(${speedRamp})`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 1100,
          width: '100%',
          textAlign: 'center',
          transform: `perspective(800px) rotateX(26deg) scale(${speedRamp})`,
          zIndex: 35,
        }}
      >
        <div
          style={{
            fontFamily: 'Impact, sans-serif',
            fontSize: 96,
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
            marginTop: 26,
            display: 'inline-block',
            background: '#facc15',
            color: '#0f172a',
            fontFamily: 'sans-serif',
            fontSize: 33,
            fontWeight: 900,
            padding: '12px 34px',
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
    <Sequence from={0} durationInFrames={90}><Scene1 /></Sequence>
    <Sequence from={90} durationInFrames={90}><Scene2 /></Sequence>
    <Sequence from={180} durationInFrames={120}><Scene3 /></Sequence>
    <Sequence from={300} durationInFrames={270}><Scene4 /></Sequence>
    <Sequence from={570} durationInFrames={180}><Scene5 /></Sequence>
    <Sequence from={750} durationInFrames={90}><Scene6 /></Sequence>
    <Sequence from={840} durationInFrames={150}><Scene7 /></Sequence>
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
