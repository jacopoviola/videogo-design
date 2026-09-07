/* Today — regenerated from the founder's demo screen (the Apr 2025 mock), inside the system.
   The demo showed three things: a suggested topic, a video ready to review, and a saves insight.
   All three survive. What does not: the utility rail (a fifth navigation, §0.2), the assistant
   transcript with timestamps (§0.4, non-product #16/#17), and the permanent "Need — nothing
   needed" row (it inverts what a hueless screen means, D05).
   The suggested topic drops from a second ask to the Upcoming strip: §3 allows exactly one
   non-blocking ask per visit, and READY is the consequential one. */
(function () {
  const { useState } = React;
  const V = () => window.VG;

  const mono = (size, weight, track) => ({ fontFamily: 'var(--vg-mono)', fontSize: size, fontWeight: weight, letterSpacing: track, textTransform: 'uppercase', lineHeight: 1 });
  const label = { ...mono(10, 600, '0.16em'), color: 'var(--vg-text-3)' };
  const micro = { ...mono(9, 500, '0.14em'), color: 'var(--vg-text-3)' };
  const faint = { ...mono(9, 500, '0.14em'), color: 'var(--vg-text-4)' };

  function Upcoming() {
    const rows = [
      ['Sat 11:00', 'What your boiler noise could mean', 'In production'],
    ];
    return (
      <section style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '16px 18px', background: 'var(--vg-shell)', border: 'var(--vg-rule-hi)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={label}>Upcoming · schedule, never a recommendation</span>
          <span style={faint}>Next 7 days</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
          {rows.map((r, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '88px 1fr auto', gap: 12, alignItems: 'baseline' }}>
              <span style={{ ...mono(9.5, 600, '0.12em'), color: 'var(--vg-text-3)' }}>{r[0]}</span>
              <span style={{ font: 'var(--vg-value)', color: 'var(--vg-text-2)' }}>{r[1]}</span>
              <span style={{ ...mono(9, 500, '0.14em'), color: 'var(--vg-text-3)' }}>{r[2]}</span>
            </div>
          ))}
        </div>
      </section>
    );
  }

  function TodayFromDemo({ nav = 'Today' }) {
    const { Nav, ObjectCard, Button, EvidenceRow, Thumbnail, MetricTile, Composer } = V();
    const [active, setActive] = useState(nav);
    return (
      <div data-screen-label="07b Today · from the demo" style={{ width: 1280, height: 800, display: 'flex', background: 'var(--vg-canvas)', color: 'var(--vg-text-2)', fontFamily: 'var(--vg-sans)', overflow: 'hidden' }}>
        <Nav active={active} onSelect={setActive} account={{ name: 'Moretti Impianti', sector: 'Home services' }} />
        <main style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', padding: '30px 34px 24px' }}>

          <header style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', paddingBottom: 18 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              <span style={label}>Your video advantage, every day</span>
              <h1 style={{ margin: 0, font: 'var(--vg-display-2)', letterSpacing: '-0.035em', color: 'var(--vg-text-1)' }}>Today</h1>
            </div>
            <span style={micro}>Wed · 23 Apr</span>
          </header>

          <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 780 }}>

            <ObjectCard
              type="ready"
              title="“How to top up your boiler pressure” is ready"
              body="I turned your existing photos into a voiceover explainer. Nothing goes live until you publish it."
              media={
                <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                  <Thumbnail duration="1:08" />
                  <EvidenceRow rows={[
                    { k: 'Recommended', v: 'Instagram, Thursday 18:00 — caption and time editable before it goes out' },
                    { k: 'Why this', v: 'Boiler-pressure questions spike in your reviews before winter' },
                  ]} style={{ flex: 1, minWidth: 0 }} />
                </div>
              }
              actions={<><Button variant="primary">Publish</Button><Button>Schedule</Button><Button>Change something</Button><Button>Reject</Button></>}
            />

            <ObjectCard
              type="learned"
              title="Question-led videos are getting saved more than promotional ones"
              media={
                <div style={{ display: 'flex', gap: 16, alignItems: 'stretch' }}>
                  <MetricTile label="Saves · last 28 days" value="+32%" delta="against your own baseline" style={{ minWidth: 210 }} />
                  <EvidenceRow rows={[
                    { k: 'Evidence', v: '14 videos over 28 days, this account only' },
                    { k: 'Next policy', v: 'Question-led structures move ahead of promotional ones in the plan' },
                    { k: 'Bookings', v: 'Not observable — no booking link connected' },
                  ]} style={{ flex: 1, minWidth: 0 }} />
                </div>
              }
            />

            <Upcoming />
          </div>

          <Composer style={{ marginTop: 16 }} />
        </main>
      </div>
    );
  }

  window.VGDemoBoards = { TodayFromDemo };
})();
