/* The eight VIDEOGO artboards plus two extra screens, as React components over window.VG.
   Loaded by _dev/loader.js consumers after VGReady. Each board is 1280×800 unless noted. */
(function () {
  const { useState } = React;
  const V = () => window.VG;

  const mono = (size, weight, track) => ({ fontFamily: 'var(--vg-mono)', fontSize: size, fontWeight: weight, letterSpacing: track, textTransform: 'uppercase', lineHeight: 1 });
  const label = { ...mono(10, 600, '0.16em'), color: 'var(--vg-text-3)' };
  const micro = { ...mono(9, 500, '0.14em'), color: 'var(--vg-text-3)' };
  const faint = { ...mono(9, 500, '0.14em'), color: 'var(--vg-text-4)' };
  const body = { font: 'var(--vg-body)', color: 'var(--vg-text-2)', margin: 0, maxWidth: '58ch', textWrap: 'pretty' };
  const small = { font: 'var(--vg-small)', color: 'var(--vg-text-2)', margin: 0 };

  function Board({ n, title, note, children, width = 1280, height = 800, style }) {
    const { Wordmark } = V();
    return (
      <div data-screen-label={n + ' ' + title} style={{ width, height, background: 'var(--vg-canvas)', color: 'var(--vg-text-2)', display: 'flex', flexDirection: 'column', overflow: 'hidden', fontFamily: 'var(--vg-sans)', ...style }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '26px 34px 0' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 16 }}>
            <span style={label}>{n} · {title}</span>
            {note && <span style={faint}>{note}</span>}
          </div>
          <Wordmark mark={11} />
        </div>
        <div style={{ flex: 1, minHeight: 0, padding: '30px 34px 34px', display: 'flex', flexDirection: 'column' }}>{children}</div>
      </div>
    );
  }
  function Section({ title, children, style }) {
    return (<div style={{ display: 'flex', flexDirection: 'column', gap: 12, minWidth: 0, ...style }}><span style={label}>{title}</span>{children}</div>);
  }
  function Spec({ k, v }) {
    return (<div style={{ display: 'grid', gridTemplateColumns: '88px 1fr', gap: 12, alignItems: 'baseline' }}><span style={{ ...mono(9.5, 600, '0.12em'), color: 'var(--vg-text-3)' }}>{k}</span><span style={{ font: 'var(--vg-value)', color: 'var(--vg-text-2)' }}>{v}</span></div>);
  }
  function Swatch({ hex, name, role, wide, ink }) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minWidth: 0, flex: wide ? 2 : 1 }}>
        <div style={{ height: 64, background: hex, border: '1px solid var(--vg-hairline-hi)', display: 'flex', alignItems: 'flex-end', padding: 8 }}>
          {ink && <span style={{ ...mono(9, 500, '0.14em'), color: ink }}>Aa</span>}
        </div>
        <span style={{ ...label, color: 'var(--vg-text-2)' }}>{name}</span>
        <span style={{ ...mono(10, 500, '0.04em'), color: 'var(--vg-text-1)', textTransform: 'none' }}>{hex}</span>
        {role && <span style={small}>{role}</span>}
      </div>
    );
  }

  /* ---------- 00 BRAND ---------- */
  function Brand() {
    const { Wordmark, Mark, LabelChip } = V();
    return (
      <Board n="00" title="Brand" note="Achromatic · glyph at 1.4× cap height, in the text colour, on nothing">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, flex: 1, minHeight: 0 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 30 }}>
            <Section title="Lockup — glyph 1.4× cap height, centred on the wordmark · gap 0.6× cap · Instrument Sans 700 +0.14em">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24, padding: '28px 24px', border: 'var(--vg-rule-hi)' }}>
                <Wordmark mark={56} />
                <Wordmark mark={28} />
                <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}><Wordmark mark={12} /><span style={faint}>92px — minimum lockup · below that, glyph alone</span></div>
              </div>
              <div style={{ background: 'var(--vg-bone)', padding: '28px 24px', display: 'flex', alignItems: 'center', gap: 40 }}>
                <Wordmark mark={28} inverse /><Mark size={44} inverse />
              </div>
            </Section>
            <Section title="Two colourways. No third lockup exists.">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <Spec k="Bone" v="#F5F2EC on #0C0B09" /><Spec k="Inverse" v="#0C0B09 on #F5F2EC" />
                <Spec k="Never" v="crimson or amber, on a photograph, on a gradient, rounded, outlined, with a shadow, rotated, or replaced by a camera / play icon" />
              </div>
            </Section>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 30 }}>
            <Section title="Mark — the glyph alone, transparent ground, 1.4× cap height">
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 28 }}>
                <Mark size={160} /><Mark size={96} /><Mark size={48} /><Mark size={24} /><Mark size={12} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginLeft: 12 }}><LabelChip kind="need">NEED</LabelChip><LabelChip kind="ready">READY</LabelChip><span style={faint}>The chip is the mark's silhouette</span></div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <Spec k="Glyph" v="The owner's E-chevron, terminals squared (radius 0 applies to the mark too). Its bounding box is a square — the label chip inherits that silhouette." />
                <Spec k="Colour" v="Always the wordmark's colour: bone on canvas, canvas on bone. Never a filled container behind it." />
                <Spec k="Size" v="Glyph height = 1.4 × cap height, vertically centred on the caps. Gap = 0.6 × cap height." />
                <Spec k="Clear space" v="One glyph-width on every side. Nothing enters it." />
                <Spec k="Files" v="assets/videogo-mark.svg · videogo-mark-inverse.svg · videogo-lockup.svg / -inverse (live text — outline before filing)" />
              </div>
            </Section>
            <Section title="Clear space">
              <div style={{ display: 'inline-flex', alignSelf: 'flex-start', padding: 40, border: '1px dashed var(--vg-border)', position: 'relative' }}>
                <Wordmark mark={40} />
                <span style={{ ...faint, position: 'absolute', top: 12, left: 40 }}>1× mark</span>
              </div>
            </Section>
          </div>
        </div>
      </Board>
    );
  }

  /* ---------- 01 TOKENS ---------- */
  function Tokens() {
    return (
      <Board n="01" title="Tokens" note="Palette · ramp · space · form">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, flex: 1 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            <Section title="Semantic — colour means you are needed">
              <div style={{ display: 'flex', gap: 12 }}>
                <Swatch hex="#FF0048" name="signal" role="VIDEOGO is blocked. NEED labels only." ink="#0C0B09" />
                <Swatch hex="#E9A93C" name="action" role="Waiting on your authorization. READY labels + primary controls." ink="#0C0B09" />
              </div>
            </Section>
            <Section title="Surface — warm near-black, hue ~65">
              <div style={{ display: 'flex', gap: 12 }}>
                <Swatch hex="#0C0B09" name="canvas" role="The page" />
                <Swatch hex="#12100E" name="shell" role="Nav, resting objects" />
                <Swatch hex="#171512" name="panel" role="Objects that need you" />
                <Swatch hex="#211E1A" name="hairline" role="Default rule" />
                <Swatch hex="#292520" name="hairline-hi" role="Card edge" />
                <Swatch hex="#37322B" name="border" role="Emphasis, controls" />
              </div>
            </Section>
            <Section title="Text">
              <div style={{ display: 'flex', gap: 12 }}>
                <Swatch hex="#F5F2EC" name="t1" role="Display, statements · 17.4:1" />
                <Swatch hex="#A59E92" name="t2" role="Body · 8.5:1" />
                <Swatch hex="#6F685C" name="t3" role="Mono labels only · 3.9:1" />
                <Swatch hex="#4B453C" name="t4" role="Faint, absence · 2.0:1" />
              </div>
            </Section>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            <Section title="Elevation — one ramp step plus a border. No shadows.">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div style={{ background: 'var(--vg-panel)', border: 'var(--vg-rule-border)', padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 8 }}><span style={label}>Needs you</span><span style={{ ...body, color: 'var(--vg-text-1)' }}>panel #171512 + border #37322B</span></div>
                <div style={{ background: 'var(--vg-shell)', border: 'var(--vg-rule-hi)', padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 8 }}><span style={label}>At rest</span><span style={body}>shell #12100E + hairline-hi #292520</span></div>
              </div>
            </Section>
            <Section title="Space — 4px base">
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12 }}>
                {[4, 8, 12, 16, 20, 24, 32, 40, 56].map(s => (
                  <div key={s} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: s, height: s, background: 'var(--vg-border)' }} />
                    <span style={{ ...mono(9.5, 500, '0.04em'), color: 'var(--vg-text-2)' }}>{s}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 4 }}>
                <Spec k="Nav" v="214px, fixed" /><Spec k="Page" v="30px vertical · 34px horizontal" /><Spec k="Card" v="16px vertical · 18px horizontal · 10px between parts" />
                <Spec k="Objects" v="12px between objects · 6–7px between rows" /><Spec k="Silence" v="48px vertical — the one exception" />
              </div>
            </Section>
            <Section title="Form">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <Spec k="Radius" v="0. Everywhere, without exception." /><Spec k="Shadow" v="None. Elevation is a ramp step plus a border." />
                <Spec k="Absence" v="135° hatch, 5px stripe, #100E0C / #151310, dashed hairline-hi" /><Spec k="Motion" v="120ms state · 200ms enter · 320ms page · cubic-bezier(.2,0,0,1) · 6px max travel" />
              </div>
              <div style={{ height: 40, background: 'var(--vg-hatch)', border: 'var(--vg-rule-absent)' }} />
            </Section>
          </div>
        </div>
      </Board>
    );
  }

  /* ---------- 02 TYPE ---------- */
  function TypeSpecimen({ name, spec, style: st, children }) {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: 24, alignItems: 'baseline', paddingBottom: 14, borderBottom: 'var(--vg-rule)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}><span style={label}>{name}</span><span style={faint}>{spec}</span></div>
        <div style={{ margin: 0, color: 'var(--vg-text-1)', ...st }}>{children}</div>
      </div>
    );
  }
  function Type() {
    return (
      <Board n="02" title="Type" note="Instrument Sans + IBM Plex Mono · weights 450 / 500 / 700 only">
        <div style={{ display: 'grid', gridTemplateColumns: '1.35fr 1fr', gap: 48, flex: 1, minHeight: 0 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <TypeSpecimen name="Display 1" spec="700 · 44/1.02 · −0.04em" style={{ font: 'var(--vg-display-1)', letterSpacing: '-0.04em' }}>Give VIDEOGO your business</TypeSpecimen>
            <TypeSpecimen name="Display 2" spec="700 · 34/1.06 · −0.035em" style={{ font: 'var(--vg-display-2)', letterSpacing: '-0.035em' }}>Today</TypeSpecimen>
            <TypeSpecimen name="Title" spec="500 · 20/1.30 · −0.015em" style={{ font: 'var(--vg-title)', letterSpacing: '-0.015em' }}>Instagram connection expired — publishing is paused</TypeSpecimen>
            <TypeSpecimen name="Voice" spec="450 · 16/1.60 · VIDEOGO speaking" style={{ font: 'var(--vg-voice)' }}>I'll keep intros tighter on comparison videos from now on.</TypeSpecimen>
            <TypeSpecimen name="Body" spec="450 · 13.5/1.55" style={{ font: 'var(--vg-body)', color: 'var(--vg-text-2)' }}>Thursday's boiler-check video is scheduled but can't go live until the connection is restored.</TypeSpecimen>
            <TypeSpecimen name="Small" spec="450 · 12/1.5" style={{ font: 'var(--vg-small)', color: 'var(--vg-text-2)' }}>Upcoming is schedule, never a recommendation.</TypeSpecimen>
            <TypeSpecimen name="Label" spec="mono 600 · 10 · +0.16em caps" style={{ ...label, color: 'var(--vg-text-2)' }}>Next policy</TypeSpecimen>
            <TypeSpecimen name="Micro" spec="mono 500 · 9 · +0.14em caps" style={micro}>Varese · Home services</TypeSpecimen>
            <TypeSpecimen name="Measured" spec="mono 500 · any size · numbers never in the sans" style={{ font: 'var(--vg-metric)' }}>41 · 62% · €2,400 · 1:08</TypeSpecimen>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            <Section title="Three registers">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ borderLeft: 'var(--vg-rule-border)', paddingLeft: 14, display: 'flex', flexDirection: 'column', gap: 6 }}><span style={label}>If VIDEOGO speaks</span><span style={{ font: 'var(--vg-voice)', color: 'var(--vg-text-1)' }}>I'm preparing your next videos.</span><span style={small}>Instrument Sans 16/450. First person, sentence case.</span></div>
                <div style={{ borderLeft: 'var(--vg-rule-border)', paddingLeft: 14, display: 'flex', flexDirection: 'column', gap: 6 }}><span style={label}>If the UI labels</span><span style={{ ...label, color: 'var(--vg-text-2)' }}>Saves · last 28 days</span><span style={small}>IBM Plex Mono 10/600, +0.16em, uppercase.</span></div>
                <div style={{ borderLeft: 'var(--vg-rule-border)', paddingLeft: 14, display: 'flex', flexDirection: 'column', gap: 6 }}><span style={label}>If it is a measured value</span><span style={{ font: 'var(--vg-metric)', color: 'var(--vg-text-1)' }}>+32%</span><span style={small}>IBM Plex Mono, at whatever size the context needs.</span></div>
              </div>
            </Section>
            <Section title="Rules">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <Spec k="Weights" v="450, 500, 700. 400 looks thin on this ground — body sits at 450." />
                <Spec k="Tracking" v="Negative and increasing with size; positive below 11px. Nothing between 12 and 16px carries tracking." />
                <Spec k="Measure" v="66 characters maximum for prose. Evidence values never wrap." />
                <Spec k="Licence" v="Both faces SIL OFL 1.1 — safe in the wordmark, safe to trademark." />
              </div>
            </Section>
          </div>
        </div>
      </Board>
    );
  }

  /* ---------- 03 CONTROLS ---------- */
  function Controls() {
    const { Button, LabelChip, Nav, AccountControl, Composer } = V();
    const [active, setActive] = useState('Today');
    return (
      <Board n="03" title="Controls" note="Buttons · chips · nav · account · composer">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 48, flex: 1, minHeight: 0 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 30 }}>
            <Section title="Buttons — three only · 34px desktop / 44px touch">
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                <Button variant="blocking">Fix connection</Button><Button variant="primary">Publish</Button><Button>Schedule</Button><Button>Dismiss</Button><Button disabled>Later</Button>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Button variant="blocking" touch>Fix connection</Button><Button variant="primary" touch>Publish</Button><Button touch>Schedule</Button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <Spec k="Blocking" v="Bone fill, dark text. Only inside a NEED — the crimson already carries the meaning." />
                <Spec k="Primary" v="Amber fill, dark text. One per object, never two." />
                <Spec k="Ghost" v="Border #37322B, text-2, weight 450. Everything else." />
                <Spec k="Feedback" v="120ms colour only. Hover and press never move the control." />
              </div>
            </Section>
            <Section title="Label chips — the same square as the mark">
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <LabelChip kind="need">NEED</LabelChip><LabelChip kind="ready">READY</LabelChip><LabelChip kind="next">NEXT</LabelChip><LabelChip kind="learned">LEARNED</LabelChip><LabelChip kind="plain">Upcoming</LabelChip>
              </div>
              <p style={body}>Crimson and amber exist as fills only here and on primary controls. Anywhere else they are a defect.</p>
            </Section>
            <Section title="Composer — persistent secondary strip, never the page">
              <Composer />
            </Section>
            <Section title="Account control">
              <div style={{ width: 214, background: 'var(--vg-shell)', border: 'var(--vg-rule-hi)', padding: '6px 8px' }}><AccountControl /></div>
            </Section>
          </div>
          <Section title="Nav — four items, forever">
            <div style={{ height: 460, display: 'flex' }}><Nav active={active} onSelect={setActive} account={{ name: 'Moretti Impianti', sector: 'Home services' }} style={{ height: '100%' }} /></div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <Spec k="Active" v="shell → #1C1A16, text-1, weight 500" /><Spec k="Never" v="amber, a badge, a count, a fifth item" />
            </div>
          </Section>
        </div>
      </Board>
    );
  }

  /* ---------- 04 CONTENT ---------- */
  function Content() {
    const { Thumbnail, Attribution, EvidenceRow, MetricTile, AbsenceTile, PermissionLockup, ProcessStages, TRUST_LINE } = V();
    return (
      <Board n="04" title="Content" note="Thumbnail · attribution · evidence · metric tiles · permission">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, flex: 1, minHeight: 0 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 30 }}>
            <Section title="Media thumbnail — 16:9 · 168×96 · duration mono 9.5/600 on 86% canvas">
              <div style={{ display: 'flex', gap: 12 }}><Thumbnail duration="2:14" style={{ background: 'var(--vg-panel)', border: 0 }} /><Thumbnail duration="1:08" /></div>
              <p style={small}>Left: a still would sit here. Right: empty state uses the absence hatch — never a spinner, never a play icon.</p>
            </Section>
            <Section title="Attribution — a bone square beside first-person statements only">
              <Attribution>I turned your existing photos into a voiceover explainer. Publishing is the authorization — nothing goes live until you do it.</Attribution>
              <p style={small}>No timestamp, no name label, no chat bubble, no second speaker.</p>
            </Section>
            <Section title="Evidence row — key 88px mono, value sans, one left rule">
              <EvidenceRow rows={[
                { k: 'Why this', v: "It's the most repeated question in your Google reviews and DMs this month" },
                { k: 'Expected', v: 'Stronger saves and profile visits; direct booking impact is uncertain' },
                { k: 'Evidence', v: '12 videos over 8 weeks, this account only' }]} />
              <p style={small}>Never a table, an icon or a chart. This is principle 04 made mechanical: evidence can never be mistaken for opinion.</p>
            </Section>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 30 }}>
            <Section title="Metric tile & delta — the window is part of the label">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0,1fr))', gap: 12 }}>
                <MetricTile label="Saves · last 28 days" value="41" delta="3.1× your average" />
                <MetricTile label="Revenue · this month" value="€2,400" provenance="You told me" />
                <AbsenceTile label="Direct bookings · last 28 days" reason="no booking link connected" />
              </div>
            </Section>
            <Section title="Process stages — observable process, opaque method">
              <ProcessStages stages={['Understanding your business', 'Finding opportunities', 'Building the video', 'Checking consistency', 'Ready']} current={2} note="usually a few minutes" />
            </Section>
            <Section title="Permission lockup — granted · requested · refused">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <PermissionLockup state="granted" scope="Organic educational auto-publish" detail="Educational videos publish on your schedule without review." />
                <PermissionLockup state="requested" scope="Publish educational videos without review" detail="I'd like to stop asking for each one. You can revoke this at any time." />
                <PermissionLockup state="refused" scope="Promotional auto-publish" />
                <PermissionLockup state="refused" scope="Paid spend" />
                <span style={{ ...label, marginTop: 4 }}>{TRUST_LINE}</span>
              </div>
            </Section>
          </div>
        </div>
      </Board>
    );
  }

  /* ---------- 05 OBJECT TYPES ---------- */
  function Objects() {
    const { ObjectCard, Button, EvidenceRow, Thumbnail } = V();
    return (
      <Board n="05" title="Object types" note="Four objects, one shell — only the chip and the elevation change">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, flex: 1, minHeight: 0, alignContent: 'start' }}>
          <ObjectCard type="need" title="Instagram connection expired — publishing is paused"
            body="Thursday's boiler-check video is scheduled but can't go live until the connection is restored. Takes about a minute."
            actions={<Button variant="blocking">Fix connection</Button>} />
          <ObjectCard type="ready" title="“3 signs your boiler needs a check” is ready"
            body="Recommended for Instagram, Thursday 18:00. Publishing is the authorization — nothing goes live until you do it."
            media={<Thumbnail duration="1:08" />}
            actions={<><Button variant="primary">Publish</Button><Button>Schedule</Button><Button>Change something</Button><Button>Reject</Button></>} />
          <ObjectCard type="next" title="I recommend answering “how long does a boiler service take?” on a camera-free video"
            evidence={<EvidenceRow rows={[{ k: 'Why this', v: "It's the most repeated question in your Google reviews and DMs this month" }, { k: 'Expected', v: 'Stronger saves and profile visits; direct booking impact is uncertain' }]} />}
            actions={<><Button variant="primary">Good — make it</Button><Button>Later</Button><Button>Dismiss</Button></>} />
          <ObjectCard type="learned" title="Videos answering real customer questions get saved about 3× more than promotional ones"
            evidence={<EvidenceRow rows={[{ k: 'Evidence', v: '12 videos over 8 weeks, this account only' }, { k: 'Next policy', v: 'Question-led structures move ahead of promotional ones in the plan' }]} />} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24, paddingTop: 24, borderTop: 'var(--vg-rule)' }}>
          <Spec k="Need" v="Crimson chip, elevated. Always first on the page. Never animates." />
          <Spec k="Ready" v="Amber chip, elevated. Publishing is the authorization — no separate Approve." />
          <Spec k="Next" v="Plain label, at rest. A recommendation with its reasoning (roadmap: RECOMMEND)." />
          <Spec k="Learned" v="Plain label, at rest. Nothing waits on the owner, so nothing is coloured." />
        </div>
      </Board>
    );
  }

  /* ---------- 06 STATES ---------- */
  function States() {
    const { ConfidenceClaim, EvidenceRow, SilenceState, AbsenceTile, MetricTile } = V();
    return (
      <Board n="06" title="States" note="Confidence ladder · silence · absence">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, flex: 1, minHeight: 0 }}>
          <Section title="Confidence ladder — certainty is how resolved the container is">
            <ConfidenceClaim grade="collecting" statement="Still collecting results." />
            <ConfidenceClaim grade="early" statement="Early signs suggest checklist-style boiler videos hold attention longer than your average." nextTest="I'll test one more before changing the plan." />
            <ConfidenceClaim grade="learned" statement="Videos answering real customer questions get saved about 3× more than promotional ones.">
              <EvidenceRow rows={[{ k: 'Evidence', v: '12 videos over 8 weeks, this account only' }, { k: 'Next policy', v: 'Question-led structures move ahead of promotional ones in the plan' }, { k: 'Saturation', v: "This angle is starting to repeat, so I'm also trying one fresh structure" }]} />
            </ConfidenceClaim>
            <p style={small}>A claim may only ever move up a grade. Never a meter, percentage or score.</p>
          </Section>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 30 }}>
            <Section title="Silence — nothing needs you · 48px vertical · zero hue">
              <SilenceState status="2 videos in production · 1 scheduled for Thursday · results collecting on 3 live videos" />
            </Section>
            <Section title="Absence — unknown is not zero">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0,1fr))', gap: 12 }}>
                <AbsenceTile label="Direct bookings" reason="no booking link connected" />
                <AbsenceTile label="DM deliveries" reason="platform does not report this" />
                <MetricTile label="Revenue" value="€2,400" provenance="You told me · owner reported" />
              </div>
              <p style={small}>The caption always says why. An owner-reported figure carries “You told me”; a measured one carries nothing.</p>
            </Section>
          </div>
        </div>
      </Board>
    );
  }

  /* ---------- 07 TODAY ---------- */
  function Upcoming() {
    const rows = [['Thu 18:00', '3 signs your boiler needs a check', 'Instagram'], ['Sat 10:00', 'How to top up your boiler pressure', 'Instagram · Facebook'], ['Tue 18:00', 'In production — question-led, camera-free', '—']];
    return (
      <section style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '16px 18px', background: 'var(--vg-shell)', border: 'var(--vg-rule-hi)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={label}>Upcoming · schedule, never a recommendation</span><span style={faint}>Next 7 days</span></div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
          {rows.map((r, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '88px 1fr auto', gap: 12, alignItems: 'baseline' }}>
              <span style={{ ...mono(9.5, 600, '0.12em'), color: 'var(--vg-text-3)' }}>{r[0]}</span>
              <span style={{ font: 'var(--vg-value)', color: 'var(--vg-text-2)' }}>{r[1]}</span>
              <span style={{ ...mono(9, 500, '0.14em'), color: r[2] === '—' ? 'var(--vg-text-4)' : 'var(--vg-text-3)' }}>{r[2]}</span>
            </div>
          ))}
        </div>
      </section>
    );
  }
  function TodayScreen({ nav = 'Today' }) {
    const { Nav, ObjectCard, Button, EvidenceRow, Thumbnail, Composer } = V();
    const [active, setActive] = useState(nav);
    return (
      <div data-screen-label="07 Today" style={{ width: 1280, height: 800, display: 'flex', background: 'var(--vg-canvas)', color: 'var(--vg-text-2)', fontFamily: 'var(--vg-sans)', overflow: 'hidden' }}>
        <Nav active={active} onSelect={setActive} account={{ name: 'Moretti Impianti', sector: 'Home services' }} />
        <main style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', padding: '30px 34px 24px' }}>
          <header style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', paddingBottom: 24 }}>
            <h1 style={{ margin: 0, font: 'var(--vg-display-2)', letterSpacing: '-0.035em', color: 'var(--vg-text-1)' }}>Today</h1>
            <span style={micro}>Wed · 23 Apr</span>
          </header>
          <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 760 }}>
            <ObjectCard type="ready" title="“3 signs your boiler needs a check” is ready"
              body="I turned your existing photos into a voiceover explainer. Recommended for Instagram, Thursday 18:00 — nothing goes live until you publish it."
              media={<Thumbnail duration="1:08" />}
              actions={<><Button variant="primary">Publish</Button><Button>Schedule</Button><Button>Change something</Button><Button>Reject</Button></>} />
            <ObjectCard type="learned" title="Videos answering real customer questions get saved about 3× more than promotional ones"
              evidence={<EvidenceRow rows={[{ k: 'Evidence', v: '12 videos over 8 weeks, this account only' }, { k: 'Next policy', v: 'Question-led structures move ahead of promotional ones in the plan' }]} />} />
            <Upcoming />
          </div>
          <Composer style={{ marginTop: 16 }} />
        </main>
      </div>
    );
  }

  /* ---------- 08 LIVE ---------- */
  function LiveScreen() {
    const { Nav, MetricTile, AbsenceTile, ConfidenceClaim, EvidenceRow } = V();
    const [active, setActive] = useState('Knowledge');
    return (
      <div data-screen-label="08 Live" style={{ width: 1280, height: 800, display: 'flex', background: 'var(--vg-canvas)', color: 'var(--vg-text-2)', fontFamily: 'var(--vg-sans)', overflow: 'hidden' }}>
        <Nav active={active} onSelect={setActive} account={{ name: 'Moretti Impianti', sector: 'Home services' }} />
        <main style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', padding: '30px 34px', gap: 24 }}>
          <header style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <span style={label}>Knowledge · Live</span>
              <h1 style={{ margin: 0, font: 'var(--vg-display-2)', letterSpacing: '-0.035em', color: 'var(--vg-text-1)' }}>What the last 28 days taught me</h1>
            </div>
            <span style={micro}>Against this account's own baseline</span>
          </header>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0,1fr))', gap: 12 }}>
            <MetricTile label="Saves · last 28 days" value="41" delta="3.1× your average" />
            <MetricTile label="Completion · last 28 days" value="62%" delta="above your baseline" />
            <MetricTile label="Profile visits · last 28 days" value="18" delta="context, not the goal" />
            <AbsenceTile label="Direct bookings · last 28 days" reason="no booking link connected" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 12, alignItems: 'start' }}>
            <ConfidenceClaim grade="learned" statement="Videos answering real customer questions get saved about 3× more than promotional ones.">
              <EvidenceRow rows={[{ k: 'Evidence', v: '12 videos over 8 weeks, this account only' }, { k: 'Next policy', v: 'Question-led structures move ahead of promotional ones in the plan' }, { k: 'Saturation', v: "This angle is starting to repeat, so I'm also trying one fresh structure" }]} />
            </ConfidenceClaim>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <ConfidenceClaim grade="early" statement="Early signs suggest checklist-style boiler videos hold attention longer than your average." nextTest="I'll test one more before changing the plan." />
              <ConfidenceClaim grade="collecting" statement="Still collecting results on the two camera-free videos from last week." />
            </div>
          </div>
        </main>
      </div>
    );
  }

  /* ---------- TODAY · MOBILE (390×844) ---------- */
  function TodayMobile() {
    const { Nav, Wordmark, ObjectCard, Button, EvidenceRow, Thumbnail, Composer } = V();
    const [active, setActive] = useState('Today');
    return (
      <div data-screen-label="Today mobile" style={{ width: 390, height: 844, display: 'flex', flexDirection: 'column', background: 'var(--vg-canvas)', color: 'var(--vg-text-2)', fontFamily: 'var(--vg-sans)', overflow: 'hidden' }}>
        <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '54px 20px 14px' }}>
          <Wordmark mark={11} /><span style={micro}>Wed · 23 Apr</span>
        </header>
        <div style={{ padding: '0 20px 16px' }}><h1 style={{ margin: 0, font: 'var(--vg-display-2)', letterSpacing: '-0.035em', color: 'var(--vg-text-1)' }}>Today</h1></div>
        <div style={{ flex: 1, minHeight: 0, overflow: 'hidden', padding: '0 12px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <ObjectCard type="ready" title="“3 signs your boiler needs a check” is ready" body="Recommended for Instagram, Thursday 18:00. Nothing goes live until you publish it."
            media={<Thumbnail duration="1:08" width={168} height={96} />}
            actions={<><Button variant="primary" touch>Publish</Button><Button touch>Schedule</Button><Button touch>Reject</Button></>} />
          <ObjectCard type="learned" title="Question-led videos get saved about 3× more than promotional ones"
            evidence={<EvidenceRow rows={[{ k: 'Evidence', v: '12 videos over 8 weeks, this account only' }]} />} />
        </div>
        <Composer touch style={{ margin: '12px 12px 8px' }} />
        <Nav orientation="bottom" active={active} onSelect={setActive} style={{ paddingBottom: 20 }} />
      </div>
    );
  }

  /* ---------- SITE · marketing surface (1280×1500) ---------- */
  function Site() {
    const { Wordmark, Button, ObjectCard, EvidenceRow, Thumbnail, AbsenceTile, MetricTile, SilenceState, ProcessStages, FeedPreview } = V();
    const eyebrow = { ...label, color: 'var(--vg-text-3)' };
    return (
      <div data-screen-label="Site" style={{ width: 1280, background: 'var(--vg-canvas)', color: 'var(--vg-text-2)', fontFamily: 'var(--vg-sans)' }}>
        <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '28px 56px', borderBottom: 'var(--vg-rule)' }}>
          <Wordmark mark={12} />
          <nav style={{ display: 'flex', gap: 28, font: 'var(--vg-small)', color: 'var(--vg-text-2)' }}><span>How it works</span><span>What it learns</span><span>Permissions</span><span>Pricing</span></nav>
          <Button variant="primary">Start with your business</Button>
        </header>
        <section style={{ padding: '96px 56px 72px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 56, alignItems: 'end' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            <span style={eyebrow}>A social-video engine for small businesses</span>
            <h1 style={{ margin: 0, fontFamily: 'var(--vg-sans)', fontWeight: 700, fontSize: 72, lineHeight: 1.0, letterSpacing: '-0.04em', color: 'var(--vg-text-1)', textWrap: 'balance' }}>Give VIDEOGO your business. Open it less every month.</h1>
            <p style={{ margin: 0, font: 'var(--vg-voice)', color: 'var(--vg-text-2)', maxWidth: '52ch', textWrap: 'pretty' }}>It finds what deserves communicating, produces the video, publishes within the permissions you grant, and learns from what your audience actually does. You approve. It works.</p>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}><Button variant="primary" touch>Start with your business</Button><Button touch>See what it learned for a heating business</Button></div>
            <span style={{ ...micro, color: 'var(--vg-text-4)' }}>VIDEOGO only publishes within permissions you grant.</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <ObjectCard type="ready" title="“3 signs your boiler needs a check” is ready" body="Recommended for Instagram, Thursday 18:00. Nothing goes live until you publish it." media={<Thumbnail duration="1:08" />}
              actions={<><Button variant="primary">Publish</Button><Button>Schedule</Button><Button>Reject</Button></>} />
            <ObjectCard type="learned" title="Videos answering real customer questions get saved about 3× more than promotional ones"
              evidence={<EvidenceRow rows={[{ k: 'Evidence', v: '12 videos over 8 weeks, this account only' }]} />} />
          </div>
        </section>
        <section style={{ padding: '72px 56px', borderTop: 'var(--vg-rule)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 56, alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <span style={eyebrow}>The first ten minutes</span>
            <h2 style={{ margin: 0, font: 'var(--vg-display-1)', letterSpacing: '-0.04em', color: 'var(--vg-text-1)', textWrap: 'balance' }}>Give it your website. Watch it work.</h2>
            <p style={{ margin: 0, font: 'var(--vg-body)', color: 'var(--vg-text-2)', maxWidth: '54ch' }}>VIDEOGO reads what you already have and shows you what it is doing at each stage. The first video appears in your feed before you have answered a single question.</p>
            <ProcessStages stages={['Understanding your business', 'Finding opportunities', 'Building the video', 'Checking consistency', 'Ready']} current={3} note="usually a few minutes" style={{ marginTop: 8 }} />
          </div>
          <FeedPreview tileWidth={150} slots={[{ state: 'ready', title: '3 signs your boiler needs a check' }, { state: 'scheduled', when: 'Sat 10:00' }, { state: 'planned' }, { state: 'planned' }, { state: 'planned' }, { state: 'planned' }]} style={{ justifySelf: 'end' }} />
        </section>
        <section style={{ padding: '72px 56px', borderTop: 'var(--vg-rule)', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 48 }}>
          {[['Finds', 'It reads your reviews, DMs and what your market asks, and picks the one thing worth saying this week.'],
            ['Produces', 'Voiceover explainers from the photos you already have. No camera, no script, no editing.'],
            ['Learns', 'Every video is measured against your own baseline. Claims are graded: collecting, early signal, learned.']].map(([h, t]) => (
            <div key={h} style={{ display: 'flex', flexDirection: 'column', gap: 14, borderTop: 'var(--vg-rule-border)', paddingTop: 20 }}>
              <span style={eyebrow}>{h}</span><p style={{ margin: 0, font: 'var(--vg-title)', letterSpacing: '-0.015em', color: 'var(--vg-text-1)', textWrap: 'pretty' }}>{t}</p>
            </div>
          ))}
        </section>
        <section style={{ padding: '72px 56px', background: 'var(--vg-hatch)', borderTop: 'var(--vg-rule)', borderBottom: 'var(--vg-rule)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 56, alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <span style={eyebrow}>Honest by construction</span>
            <h2 style={{ margin: 0, font: 'var(--vg-display-1)', letterSpacing: '-0.04em', color: 'var(--vg-text-1)', textWrap: 'balance' }}>Unknown is never shown as zero.</h2>
            <p style={{ margin: 0, font: 'var(--vg-body)', color: 'var(--vg-text-2)', maxWidth: '58ch' }}>When VIDEOGO cannot observe an outcome it draws the gap and tells you why. No invented engagement, no guaranteed views, no score for how sure it is.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0,1fr))', gap: 12 }}>
            <MetricTile label="Saves · last 28 days" value="41" delta="3.1× your average" />
            <MetricTile label="Completion · last 28 days" value="62%" delta="above your baseline" />
            <AbsenceTile label="Direct bookings · last 28 days" reason="no booking link connected" />
            <MetricTile label="Revenue · this month" value="€2,400" provenance="You told me · owner reported" />
          </div>
        </section>
        <section style={{ padding: '72px 56px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 56, alignItems: 'center' }}>
          <SilenceState status="2 videos in production · 1 scheduled for Thursday · results collecting on 3 live videos" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <span style={eyebrow}>The success screen</span>
            <h2 style={{ margin: 0, font: 'var(--vg-display-1)', letterSpacing: '-0.04em', color: 'var(--vg-text-1)', textWrap: 'balance' }}>Most software wants to be opened. This one wants to be left alone.</h2>
            <Button variant="primary" touch style={{ alignSelf: 'flex-start' }}>Start with your business</Button>
          </div>
        </section>
        <footer style={{ padding: '28px 56px', borderTop: 'var(--vg-rule)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Wordmark mark={10} /><span style={faint}>VIDEOGO only publishes within permissions you grant</span>
        </footer>
      </div>
    );
  }

  window.VGBoards = { Brand, Tokens, Type, Controls, Content, Objects, States, TodayScreen, LiveScreen, TodayMobile, Site, Board };
})();
