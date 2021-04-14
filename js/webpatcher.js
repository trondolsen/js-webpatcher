/***
 * WebPatcher for Super6
 * Copyright (c) 2021 Trond Olsen
 * Licensed under MIT
 */

((browser, ElementSeq, SynthFader, SynthSlider, SynthSteppedRotary, SynthIntervalRotary, SynthFreeRotary, SynthButton, SynthSwitch, SynthFlipSwitch, SynthPitchBender, SynthKeyboard, Midi) => {
  'use strict';

  const config = {
    title: 'Applications',
    color: 'classic',
    mouse: {
      sensitivity: 100.0
    },
    midi: {}
  };

  const applyConfig = () => new Promise((resolve) => {
    // Handle URL parameters
    var searchParams = new URLSearchParams(browser.window.location.search);
    if (searchParams.has('color')) {
      var colorParam = searchParams.get('color').toLowerCase();
      if (colorParam === 'blue' || colorParam === 'black' ||  colorParam === 'classic') {
        config.color = colorParam;
        query('.synth-chassis').css({add:[`color-${config.color}`], remove:['color-classic','color-black','color-blue']});
        browser.console.info(`Set config.color to ${config.color}`);
      }
      else {
        browser.console.info(`Invalid color parameter value used: ${config.color}`);
      }
    }

    // Create Synth controls
    var synth = {
      lfo1Waveform: new SynthSteppedRotary(query('.synth-lfo1-waveform')),
      lfo1Rate: new SynthFader(query('.synth-lfo1-rate')),
      lfo1Delay: new SynthFader(query('.synth-lfo1-delay')),
      lfo1Lrphase: new SynthFader(query('.synth-lfo1-lrphase')),
      lfo1Mode: new SynthSwitch(query('.synth-lfo1-mode')),
      ddsmodLfo: new SynthFader(query('.synth-ddsmod-lfo')),
      ddsmodEnv1: new SynthFader(query('.synth-ddsmod-env1')),
      ddsmodEnv1target: new SynthSwitch(query('.synth-ddsmod-env1target')),
      ddsmodMode: new SynthSwitch(query('.synth-ddsmod-mode')),
      ddsmodPw: new SynthFader(query('.synth-ddsmod-pw')),
      ddsmodPwm: new SynthFader(query('.synth-ddsmod-pwm')),
      ddsmodPwmsource: new SynthSwitch(query('.synth-ddsmod-pwmsource')),
      ddsmodCrossmod: new SynthFader(query('.synth-ddsmod-crossmod')),
      dds1Waveform: new SynthSteppedRotary(query('.synth-dds1-waveform')),
      dds1Range: new SynthSteppedRotary(query('.synth-dds1-range')),
      dds2Waveform: new SynthSteppedRotary(query('.synth-dds2-waveform')),
      dds2Range: new SynthSteppedRotary(query('.synth-dds2-range')),
      dds2Tune: new SynthIntervalRotary(query('.synth-dds2-tune')),
      dds2Mode: new SynthSwitch(query('.synth-dds2-mode')),
      mixerMix: new SynthIntervalRotary(query('.synth-mixer-mix')),
      vcfHpf: new SynthSwitch(query('.synth-vcf-hpf')),
      vcfDrive: new SynthSwitch(query('.synth-vcf-drive')),
      vcfFreq: new SynthFader(query('.synth-vcf-freq')),
      vcfRes: new SynthFader(query('.synth-vcf-res')),
      vcfEnv: new SynthFader(query('.synth-vcf-env')),
      vcfEnvsource: new SynthSwitch(query('.synth-vcf-envsource')),
      vcfKeytrack: new SynthSwitch(query('.synth-vcf-keytrack')),
      vcfLfo1: new SynthFader(query('.synth-vcf-lfo1')),
      vcfDds2: new SynthFader(query('.synth-vcf-dds2')),
      vcaDynamics: new SynthSwitch(query('.synth-vca-dynamics')),
      vcaEnvlevelsource: new SynthSwitch(query('.synth-vca-envlevelsource')),
      vcaEnvlevel: new SynthFader(query('.synth-vca-envlevel')),
      vcaLfo1: new SynthFader(query('.synth-vca-lfo1')),
      env1Mode: new SynthSwitch(query('.synth-env1-mode')),
      env1Keytrack: new SynthSwitch(query('.synth-env1-keytrack')),
      env1H: new SynthFader(query('.synth-env1-h')),
      env1A: new SynthFader(query('.synth-env1-a')),
      env1D: new SynthFader(query('.synth-env1-d')),
      env1S: new SynthFader(query('.synth-env1-s')),
      env1R: new SynthFader(query('.synth-env1-r')),
      env2A: new SynthFader(query('.synth-env2-a')),
      env2D: new SynthFader(query('.synth-env2-d')),
      env2S: new SynthFader(query('.synth-env2-s')),
      env2R: new SynthFader(query('.synth-env2-r')),
      perfOctave: new SynthFlipSwitch(query('.synth-perf-octave')),
      perfPortamento: new SynthSlider(query('.synth-perf-portamento')),
      perfManual: new SynthButton(query('.synth-perf-manual')),
      perfLfo2rate: new SynthIntervalRotary(query('.synth-perf-lfo2rate')),
      perfLfo2delay: new SynthIntervalRotary(query('.synth-perf-lfo2delay')),
      perfMastervolume: new SynthIntervalRotary(query('.synth-perf-mastervolume')),
      perfMode: new SynthSwitch(query('.synth-perf-mode')),
      perfLeftVcf: new SynthFader(query('.synth-perf-leftvcf')),
      perfLeftDds: new SynthFader(query('.synth-perf-leftdds')),
      perfDdstarget: new SynthSwitch(query('.synth-perf-ddstarget')),
      perfRightDds: new SynthFader(query('.synth-perf-rightdds')),
      perfRightVcf: new SynthFader(query('.synth-perf-rightvcf')),
      prefPitchbend: new SynthPitchBender(query('.synth-perf-pitchdown'),query('.synth-perf-pitchup'),query('.synth-perf-pitchpush')),
      voiceAssign: new SynthButton(query('.synth-voice-assign')),
      voiceBinaural: new SynthButton(query('.synth-voice-binaural')),
      seqTempo: new SynthIntervalRotary(query('.synth-seq-tempo')),
      seqSync: new SynthButton(query('.synth-seq-sync')),
      seqRange: new SynthButton(query('.synth-seq-range')),
      seqMode: new SynthButton(query('.synth-seq-mode')),
      seqOn: new SynthButton(query('.synth-seq-on')),
      seqHold: new SynthButton(query('.synth-seq-hold')),
      seqSeqrec: new SynthButton(query('.synth-seq-seqrec')),
      modAmount: new SynthFreeRotary(query('.synth-mod-amount')),
      modModassign: new SynthButton(query('.synth-mod-modassign')),
      mod1: new SynthButton(query('.synth-mod-1')),
      mod2: new SynthButton(query('.synth-mod-2')),
      mod3: new SynthButton(query('.synth-mod-3')),
      mod4: new SynthButton(query('.synth-mod-4')),
      mod5: new SynthButton(query('.synth-mod-5')),
      mod6: new SynthButton(query('.synth-mod-6')),
      mod7: new SynthButton(query('.synth-mod-7')),
      mod8: new SynthButton(query('.synth-mod-8')),
      modA: new SynthButton(query('.synth-mod-a')),
      modB: new SynthButton(query('.synth-mod-b')),
      modC: new SynthButton(query('.synth-mod-c')),
      modD: new SynthButton(query('.synth-mod-d')),
      modE: new SynthButton(query('.synth-mod-e')),
      modF: new SynthButton(query('.synth-mod-f')),
      modG: new SynthButton(query('.synth-mod-g')),
      modH: new SynthButton(query('.synth-mod-h')),
      modPatch: new SynthButton(query('.synth-mod-patch')),
      modShift: new SynthButton(query('.synth-mod-shift')),
      modWave: new SynthButton(query('.synth-mod-wave')),
      delayLevel: new SynthIntervalRotary(query('.synth-delay-level')),
      delayTime: new SynthIntervalRotary(query('.synth-delay-time')),
      delayFeedback: new SynthIntervalRotary(query('.synth-delay-feedback')),
      chorus1: new SynthButton(query('.synth-chorus-1')),
      chorus2: new SynthButton(query('.synth-chorus-2')),
      keyboard: new SynthKeyboard({
        24: query('.synth-octave-1-frame .synth-key-c'),
        25: query('.synth-octave-1-frame .synth-key-db'),
        26: query('.synth-octave-1-frame .synth-key-d'),
        27: query('.synth-octave-1-frame .synth-key-eb'),
        28: query('.synth-octave-1-frame .synth-key-e'),
        29: query('.synth-octave-1-frame .synth-key-f'),
        30: query('.synth-octave-1-frame .synth-key-gb'),
        31: query('.synth-octave-1-frame .synth-key-g'),
        32: query('.synth-octave-1-frame .synth-key-ab'),
        33: query('.synth-octave-1-frame .synth-key-a'),
        34: query('.synth-octave-1-frame .synth-key-bb'),
        35: query('.synth-octave-1-frame .synth-key-b'),
        36: query('.synth-octave-2-frame .synth-key-c'),
        37: query('.synth-octave-2-frame .synth-key-db'),
        38: query('.synth-octave-2-frame .synth-key-d'),
        39: query('.synth-octave-2-frame .synth-key-eb'),
        40: query('.synth-octave-2-frame .synth-key-e'),
        41: query('.synth-octave-2-frame .synth-key-f'),
        42: query('.synth-octave-2-frame .synth-key-gb'),
        43: query('.synth-octave-2-frame .synth-key-g'),
        44: query('.synth-octave-2-frame .synth-key-ab'),
        45: query('.synth-octave-2-frame .synth-key-a'),
        46: query('.synth-octave-2-frame .synth-key-bb'),
        47: query('.synth-octave-2-frame .synth-key-b'),
        48: query('.synth-octave-3-frame .synth-key-c'),
        49: query('.synth-octave-3-frame .synth-key-db'),
        50: query('.synth-octave-3-frame .synth-key-d'),
        51: query('.synth-octave-3-frame .synth-key-eb'),
        52: query('.synth-octave-3-frame .synth-key-e'),
        53: query('.synth-octave-3-frame .synth-key-f'),
        54: query('.synth-octave-3-frame .synth-key-gb'),
        55: query('.synth-octave-3-frame .synth-key-g'),
        56: query('.synth-octave-3-frame .synth-key-ab'),
        57: query('.synth-octave-3-frame .synth-key-a'),
        58: query('.synth-octave-3-frame .synth-key-bb'),
        59: query('.synth-octave-3-frame .synth-key-b'),
        60: query('.synth-octave-4-frame .synth-key-c'),
        61: query('.synth-octave-4-frame .synth-key-db'),
        62: query('.synth-octave-4-frame .synth-key-d'),
        63: query('.synth-octave-4-frame .synth-key-eb'),
        64: query('.synth-octave-4-frame .synth-key-e'),
        65: query('.synth-octave-4-frame .synth-key-f'),
        66: query('.synth-octave-4-frame .synth-key-gb'),
        67: query('.synth-octave-4-frame .synth-key-g'),
        68: query('.synth-octave-4-frame .synth-key-ab'),
        69: query('.synth-octave-4-frame .synth-key-a'),
        70: query('.synth-octave-4-frame .synth-key-bb'),
        71: query('.synth-octave-4-frame .synth-key-b'),
        72: query('.synth-octave-5-frame .synth-key-c')
      })
    };

    // Add mouse event handlers
    var addMouseTracker = (synthControl) => {
      var mouseTracking = {x: 0, y: 0, dx: 0, dy: 0, dxInVw: 0.0, dyInVw: 0.0};
      var mouseDragged = (event) => {
        mouseTracking.dx = event.clientX - mouseTracking.x;
        mouseTracking.dy = event.clientY - mouseTracking.y;
        mouseTracking.x = event.clientX;
        mouseTracking.y = event.clientY;
        mouseTracking.dxInVw = (config.mouse.sensitivity * mouseTracking.dx) / window.innerWidth;
        mouseTracking.dyInVw = (config.mouse.sensitivity * mouseTracking.dy) / window.innerHeight;
        synthControl.updateValue(mouseTracking.dxInVw, mouseTracking.dyInVw);
      };
      var fn = (event) => {
        event.preventDefault();
        mouseTracking.x = event.clientX;
        mouseTracking.y = event.clientY;
        document.body.addEventListener('mousemove', mouseDragged);
        document.body.addEventListener('mouseup',
          (event) => {
            document.body.removeEventListener('mousemove', mouseDragged);
          },
          {once:true}
        );
      };
      return fn;
    };

    var addMouseClick = (synthControl) => {
      var fn = (event) => {
        synthControl.updateValue();
      };
      return fn;
    };

    query('.synth-lfo1-waveform').event('mousedown', addMouseTracker(synth.lfo1Waveform));
    query('.synth-lfo1-rate').event('mousedown', addMouseTracker(synth.lfo1Rate));
    query('.synth-lfo1-delay').event('mousedown', addMouseTracker(synth.lfo1Delay));
    query('.synth-lfo1-lrphase').event('mousedown', addMouseTracker(synth.lfo1Lrphase));
    query('.synth-lfo1-mode').event('click', addMouseClick(synth.lfo1Mode));
    query('.synth-ddsmod-lfo').event('mousedown', addMouseTracker(synth.ddsmodLfo));
    query('.synth-ddsmod-env1').event('mousedown', addMouseTracker(synth.ddsmodEnv1));
    query('.synth-ddsmod-env1target').event('click', addMouseClick(synth.ddsmodEnv1target));
    query('.synth-ddsmod-mode').event('click', addMouseClick(synth.ddsmodMode));
    query('.synth-ddsmod-pw').event('mousedown', addMouseTracker(synth.ddsmodPw));
    query('.synth-ddsmod-pwm').event('mousedown', addMouseTracker(synth.ddsmodPwm));
    query('.synth-ddsmod-pwmsource').event('click', addMouseClick(synth.ddsmodPwmsource));
    query('.synth-ddsmod-crossmod').event('mousedown', addMouseTracker(synth.ddsmodCrossmod));
    query('.synth-dds1-waveform').event('mousedown', addMouseTracker(synth.dds1Waveform));
    query('.synth-dds1-range').event('mousedown', addMouseTracker(synth.dds1Range));
    query('.synth-dds2-waveform').event('mousedown', addMouseTracker(synth.dds2Waveform));
    query('.synth-dds2-range').event('mousedown', addMouseTracker(synth.dds2Range));
    query('.synth-dds2-tune').event('mousedown', addMouseTracker(synth.dds2Tune));
    query('.synth-dds2-mode').event('click', addMouseClick(synth.dds2Mode));
    query('.synth-mixer-mix').event('mousedown', addMouseTracker(synth.mixerMix));
    query('.synth-vcf-hpf').event('click', addMouseClick(synth.vcfHpf));
    query('.synth-vcf-drive').event('click', addMouseClick(synth.vcfDrive));
    query('.synth-vcf-freq').event('mousedown', addMouseTracker(synth.vcfFreq));
    query('.synth-vcf-res').event('mousedown', addMouseTracker(synth.vcfRes));
    query('.synth-vcf-env').event('mousedown', addMouseTracker(synth.vcfEnv));
    query('.synth-vcf-envsource').event('click', addMouseClick(synth.vcfEnvsource));
    query('.synth-vcf-keytrack').event('click', addMouseClick(synth.vcfKeytrack));
    query('.synth-vcf-lfo1').event('mousedown', addMouseTracker(synth.vcfLfo1));
    query('.synth-vcf-dds2').event('mousedown', addMouseTracker(synth.vcfDds2));
    query('.synth-vca-dynamics').event('click', addMouseClick(synth.vcaDynamics));
    query('.synth-vca-envlevelsource').event('click', addMouseClick(synth.vcaEnvlevelsource));
    query('.synth-vca-envlevel').event('mousedown', addMouseTracker(synth.vcaEnvlevel));
    query('.synth-vca-lfo1').event('mousedown', addMouseTracker(synth.vcaLfo1));
    query('.synth-env1-mode').event('click', addMouseClick(synth.env1Mode));
    query('.synth-env1-keytrack').event('click', addMouseClick(synth.env1Keytrack));
    query('.synth-env1-h').event('mousedown', addMouseTracker(synth.env1H));
    query('.synth-env1-a').event('mousedown', addMouseTracker(synth.env1A));
    query('.synth-env1-d').event('mousedown', addMouseTracker(synth.env1D));
    query('.synth-env1-s').event('mousedown', addMouseTracker(synth.env1S));
    query('.synth-env1-r').event('mousedown', addMouseTracker(synth.env1R));
    query('.synth-env2-a').event('mousedown', addMouseTracker(synth.env2A));
    query('.synth-env2-d').event('mousedown', addMouseTracker(synth.env2D));
    query('.synth-env2-s').event('mousedown', addMouseTracker(synth.env2S));
    query('.synth-env2-r').event('mousedown', addMouseTracker(synth.env2R));
    query('.synth-perf-octave').event('click', addMouseClick(synth.perfOctave));
    query('.synth-perf-portamento').event('mousedown', addMouseTracker(synth.perfPortamento));
    query('.synth-perf-manual').event('click', addMouseClick(synth.perfManual));
    query('.synth-perf-lfo2rate').event('mousedown', addMouseTracker(synth.perfLfo2rate));
    query('.synth-perf-lfo2delay').event('mousedown', addMouseTracker(synth.perfLfo2delay));
    query('.synth-perf-mastervolume').event('mousedown', addMouseTracker(synth.perfMastervolume));
    query('.synth-perf-mode').event('click', addMouseClick(synth.perfMode));
    query('.synth-perf-leftvcf').event('mousedown', addMouseTracker(synth.perfLeftVcf));
    query('.synth-perf-leftdds').event('mousedown', addMouseTracker(synth.perfLeftDds));
    query('.synth-perf-ddstarget').event('click', addMouseClick(synth.perfDdstarget));
    query('.synth-perf-rightdds').event('mousedown', addMouseTracker(synth.perfRightDds));
    query('.synth-perf-rightvcf').event('mousedown', addMouseTracker(synth.perfRightVcf));
    query('.synth-voice-assign').event('click', addMouseClick(synth.voiceAssign));
    query('.synth-voice-binaural').event('click', addMouseClick(synth.voiceBinaural));
    query('.synth-seq-tempo').event('mousedown', addMouseTracker(synth.seqTempo));
    query('.synth-seq-sync').event('click', addMouseClick(synth.seqSync));
    query('.synth-seq-range').event('click', addMouseClick(synth.seqRange));
    query('.synth-seq-mode').event('click', addMouseClick(synth.seqMode));
    query('.synth-seq-on').event('click', addMouseClick(synth.seqOn));
    query('.synth-seq-hold').event('click', addMouseClick(synth.seqHold));
    query('.synth-seq-seqrec').event('click', addMouseClick(synth.seqSeqrec));
    query('.synth-mod-amount').event('mousedown', addMouseTracker(synth.modAmount));
    query('.synth-mod-modassign').event('click', addMouseClick(synth.modModassign));
    query('.synth-mod-1').event('click', addMouseClick(synth.mod1));
    query('.synth-mod-2').event('click', addMouseClick(synth.mod2));
    query('.synth-mod-3').event('click', addMouseClick(synth.mod3));
    query('.synth-mod-4').event('click', addMouseClick(synth.mod4));
    query('.synth-mod-5').event('click', addMouseClick(synth.mod5));
    query('.synth-mod-6').event('click', addMouseClick(synth.mod6));
    query('.synth-mod-7').event('click', addMouseClick(synth.mod7));
    query('.synth-mod-8').event('click', addMouseClick(synth.mod8));
    query('.synth-mod-a').event('click', addMouseClick(synth.modA));
    query('.synth-mod-b').event('click', addMouseClick(synth.modB));
    query('.synth-mod-c').event('click', addMouseClick(synth.modC));
    query('.synth-mod-d').event('click', addMouseClick(synth.modD));
    query('.synth-mod-e').event('click', addMouseClick(synth.modE));
    query('.synth-mod-f').event('click', addMouseClick(synth.modF));
    query('.synth-mod-g').event('click', addMouseClick(synth.modG));
    query('.synth-mod-h').event('click', addMouseClick(synth.modH));
    query('.synth-mod-patch').event('click', addMouseClick(synth.modPatch));
    query('.synth-mod-shift').event('click', addMouseClick(synth.modShift));
    query('.synth-mod-wave').event('click', addMouseClick(synth.modWave));
    query('.synth-delay-level').event('mousedown', addMouseTracker(synth.delayLevel));
    query('.synth-delay-time').event('mousedown', addMouseTracker(synth.delayTime));
    query('.synth-delay-feedback').event('mousedown', addMouseTracker(synth.delayFeedback));
    query('.synth-chorus-1').event('click', addMouseClick(synth.chorus1));
    query('.synth-chorus-2').event('click', addMouseClick(synth.chorus2));

    // Attach midi handlers
    var attachMidi = (synthControl, midiPort, midiChannel, midiSpec) => {
      synthControl.midiOut = (value) => {
        var data = [midiChannel, midiSpec[0], value];
        midiPort.send(data);
        query('.midi-events').text(`${Midi.toText(data)}`);
      };
    };

    var detachMidi = (synthControl) => {
      delete synthControl.midiOut;
    };

    var attachControllers = (midiPort, midiChannel) => {
      attachMidi(synth.lfo1Rate, midiPort, midiChannel, Midi.ccControlChange[17]);
      attachMidi(synth.lfo1Delay, midiPort, midiChannel, Midi.ccControlChange[18]);
      attachMidi(synth.lfo1Lrphase, midiPort, midiChannel, Midi.ccControlChange[19]);
      attachMidi(synth.lfo1Waveform, midiPort, midiChannel, Midi.ccControlChange[16]);
      attachMidi(synth.lfo1Mode, midiPort, midiChannel, Midi.ccControlChange[20]);
      attachMidi(synth.ddsmodLfo, midiPort, midiChannel, Midi.ccControlChange[21]);
      attachMidi(synth.ddsmodEnv1, midiPort, midiChannel, Midi.ccControlChange[22]);
      attachMidi(synth.ddsmodEnv1target, midiPort, midiChannel, Midi.ccControlChange[23]);
      attachMidi(synth.ddsmodMode, midiPort, midiChannel, Midi.ccControlChange[24]);
      attachMidi(synth.ddsmodPw, midiPort, midiChannel, Midi.ccControlChange[25]);
      attachMidi(synth.ddsmodPwm, midiPort, midiChannel, Midi.ccControlChange[26]);
      attachMidi(synth.ddsmodPwmsource, midiPort, midiChannel, Midi.ccControlChange[27]);
      attachMidi(synth.ddsmodCrossmod, midiPort, midiChannel, Midi.ccControlChange[28]);
      attachMidi(synth.dds1Waveform, midiPort, midiChannel, Midi.ccControlChange[29]);
      attachMidi(synth.dds1Range, midiPort, midiChannel, Midi.ccControlChange[30]);
      attachMidi(synth.dds2Waveform, midiPort, midiChannel, Midi.ccControlChange[31]);
      attachMidi(synth.dds2Range, midiPort, midiChannel, Midi.ccControlChange[34]);
      attachMidi(synth.dds2Tune, midiPort, midiChannel, Midi.ccControlChange[35]);
      attachMidi(synth.dds2Mode, midiPort, midiChannel, Midi.ccControlChange[36]);
      attachMidi(synth.mixerMix, midiPort, midiChannel, Midi.ccControlChange[37]);
      attachMidi(synth.vcfHpf, midiPort, midiChannel, Midi.ccControlChange[40]);
      attachMidi(synth.vcfDrive, midiPort, midiChannel, Midi.ccControlChange[41]);
      attachMidi(synth.vcfFreq, midiPort, midiChannel, Midi.ccControlChange[74]);
      attachMidi(synth.vcfRes, midiPort, midiChannel, Midi.ccControlChange[71]);
      attachMidi(synth.vcfEnvsource, midiPort, midiChannel, Midi.ccControlChange[44]);
      attachMidi(synth.vcfKeytrack, midiPort, midiChannel, Midi.ccControlChange[43]);
      attachMidi(synth.vcfEnv, midiPort, midiChannel, Midi.ccControlChange[45]);
      attachMidi(synth.vcfLfo1, midiPort, midiChannel, Midi.ccControlChange[46]);
      attachMidi(synth.vcfDds2, midiPort, midiChannel, Midi.ccControlChange[47]);
      attachMidi(synth.vcaDynamics, midiPort, midiChannel, Midi.ccControlChange[48]);
      attachMidi(synth.vcaEnvlevelsource, midiPort, midiChannel, Midi.ccControlChange[49]);
      attachMidi(synth.vcaEnvlevel, midiPort, midiChannel, Midi.ccControlChange[7]);
      attachMidi(synth.vcaLfo1, midiPort, midiChannel, Midi.ccControlChange[92]);
      attachMidi(synth.env1Mode, midiPort, midiChannel, Midi.ccControlChange[50]);
      attachMidi(synth.env1Keytrack, midiPort, midiChannel, Midi.ccControlChange[51]);
      attachMidi(synth.env1H, midiPort, midiChannel, Midi.ccControlChange[52]);
      attachMidi(synth.env1A, midiPort, midiChannel, Midi.ccControlChange[53]);
      attachMidi(synth.env1D, midiPort, midiChannel, Midi.ccControlChange[54]);
      attachMidi(synth.env1S, midiPort, midiChannel, Midi.ccControlChange[55]);
      attachMidi(synth.env1R, midiPort, midiChannel, Midi.ccControlChange[56]);
      attachMidi(synth.env2A, midiPort, midiChannel, Midi.ccControlChange[73]);
      attachMidi(synth.env2D, midiPort, midiChannel, Midi.ccControlChange[72]);
      attachMidi(synth.env2S, midiPort, midiChannel, Midi.ccControlChange[57]);
      attachMidi(synth.env2R, midiPort, midiChannel, Midi.ccControlChange[58]);
      attachMidi(synth.perfManual, midiPort, midiChannel, Midi.ccControlChange[59]);
      attachMidi(synth.perfPortamento, midiPort, midiChannel, Midi.ccControlChange[5]);
      attachMidi(synth.perfLfo2rate, midiPort, midiChannel, Midi.ccControlChange[62]);
      attachMidi(synth.perfLfo2delay, midiPort, midiChannel, Midi.ccControlChange[63]);
      // attachMidi(synth.perfMastervolume, midiPort, midiChannel, Midi.ccControlChange[58]); TODO: missing midi CC
      attachMidi(synth.perfMode, midiPort, midiChannel, Midi.ccControlChange[60]);
      attachMidi(synth.perfLeftVcf, midiPort, midiChannel, Midi.ccControlChange[75]);
      attachMidi(synth.perfLeftDds, midiPort, midiChannel, Midi.ccControlChange[70]);
      attachMidi(synth.perfDdstarget, midiPort, midiChannel, Midi.ccControlChange[61]);
      attachMidi(synth.perfRightDds, midiPort, midiChannel, Midi.ccControlChange[76]);
      attachMidi(synth.perfRightVcf, midiPort, midiChannel, Midi.ccControlChange[77]);
      attachMidi(synth.voiceAssign, midiPort, midiChannel, Midi.ccControlChange[78]);
      attachMidi(synth.voiceBinaural, midiPort, midiChannel, Midi.ccControlChange[80]);
      attachMidi(synth.seqTempo, midiPort, midiChannel, Midi.ccControlChange[3]);
      attachMidi(synth.seqSync, midiPort, midiChannel, Midi.ccControlChange[81]);
      attachMidi(synth.seqRange, midiPort, midiChannel, Midi.ccControlChange[82]);
      attachMidi(synth.seqMode, midiPort, midiChannel, Midi.ccControlChange[85]);
      attachMidi(synth.seqOn, midiPort, midiChannel, Midi.ccControlChange[86]);
      attachMidi(synth.seqHold, midiPort, midiChannel, Midi.ccControlChange[87]);
      attachMidi(synth.seqSeqrec, midiPort, midiChannel, Midi.ccControlChange[89]);
      attachMidi(synth.delayLevel, midiPort, midiChannel, Midi.ccControlChange[91]);
      attachMidi(synth.delayTime, midiPort, midiChannel, Midi.ccControlChange[12]);
      attachMidi(synth.delayFeedback, midiPort, midiChannel, Midi.ccControlChange[13]);
      attachMidi(synth.chorus1, midiPort, midiChannel, Midi.ccControlChange[14]);
      attachMidi(synth.chorus2, midiPort, midiChannel, Midi.ccControlChange[15]);
    };

    // Midi setup
    var onMidiMessage = (event) => {
      var ccChannelMsg = Midi.ccChannelMessage[event.data[0]];
      var channel = event.data[0] & 0xf;

      if (ccChannelMsg === undefined) {
        browser.console.info(`Unsupported midi ${event.data[0]} data=${event.data}`);
        return;
      }

      switch(ccChannelMsg[0]) {
        case 128:
          synth.keyboard.noteOff(event.data[1]);
          break;
        case 144:
          synth.keyboard.noteOn(event.data[1], event.data[2]);
          break;
        case 176:
          switch(event.data[1]) {
            case 1:
              synth.prefPitchbend.push(event.data[2]);
              break;
          }
          break;
        case 224:
            var word = (event.data[2] << 7) | (event.data[1] & 0xf);
            synth.prefPitchbend.bend(word);
          break;
      }

      query('.midi-events').text(`${Midi.toText(event.data)}`);
    };

    window.addEventListener('load', function() {   
      if (navigator.requestMIDIAccess === undefined) {
        browser.console.info(`Midi missing`);
      }
      else {
        var onMidiSuccess = (midiAccess) => {
          browser.console.info(`Midi detected with ${midiAccess.inputs.size} inputs, ${midiAccess.outputs.size} outputs, and sysex is ${midiAccess.sysexEnabled}`);

          // Default to first midi input
          midiAccess.inputs.forEach((port, key) => {
            if (config.midi.inputPort === undefined) {
              // Set active midi input port
              config.midi.inputPort = port;
              config.midi.inputPort.onmidimessage = onMidiMessage;
              query('.midi-input').text(port.name);

              // Set midi input channel
              Object.values(Midi.midiChannels).forEach((channel) => {
                query('.midi-input-channel-list').append(
                  li({}).append(  
                    div({props: {textContent: `${channel[1]}`}, css:['dropdown-item']})
                  )
                )
              });
              query('.midi-input-channel').text(Midi.midiChannels[0][1]);

              browser.console.info(`Midi ${port.type} ${port.name} is ${port.state}`);
            }

            // Add ports to dropdown menu
            query('.midi-input-list').append(
              li({}).append(
                div({props: {textContent: `${port.name}`}, css:['dropdown-item']})
                  .event('click', (event) => {
                    if (config.midi.inputPort !== undefined) {
                      config.midi.inputPort.onmidimessage = null;
                    }
                    config.midi.inputPort = port;
                    config.midi.inputPort.onmidimessage = onMidiMessage;
                    query('.midi-input').text(port.name);
                    browser.console.info(`Midi ${port.type} ${port.name} is ${port.state}`);
                  })
              )
            );
          });

          // Default to first midi output
          midiAccess.outputs.forEach((port, key) => {
            if (config.midi.outputPort === undefined) {
              // Set active midi output port
              config.midi.outputPort = port;
              query('.midi-output').text(port.name);

              // Set midi output channel
              Object.values(Midi.midiChannels).forEach((channel) => {
                query('.midi-output-channel-list').append(
                  li({}).append(  
                    div({props: {textContent: `${channel[1]}`}, css:['dropdown-item']})
                  )
                )
              });
              query('.midi-output-channel').text(Midi.midiChannels[0][1]);
              
              // Attach midi controllers
              attachControllers(port, 176);

              browser.console.info(`Midi ${port.type} ${port.name} is ${port.state}`);
            }

            // Add to dropdown menu
            query('.midi-output-list').append(
              li({}).append(
                div({props: {textContent: `${port.name}`}, css:['dropdown-item']})
                  .event('click', (event) => {
                    if (config.midi.outputPort !== undefined) {
                      config.midi.outputPort.onmidimessage = null;
                    }
                    config.midi.outputPort = port;
                    query('.midi-output').text(port.name);
                    browser.console.info(`Midi ${port.type} ${port.name} is ${port.state}`);
                  })
              )
            );
          });

          // Handle midi state change
          midiAccess.onstatechange = function(event) {
            //browser.console.info(`Midi ${event.port.type} ${event.port.name} is ${event.port.state}`);

            // Handle port change
            if (event.port.type === 'input') {
              if (config.midi.inputPort === undefined ) {
                if (event.port.state === 'connected') {
                  config.midi.inputPort = event.port;
                  config.midi.inputPort.onmidimessage = onMidiMessage;
                  query('.midi-input').text(event.port.name);
                  browser.console.info(`Midi ${event.port.type} ${event.port.name} is ${event.port.state}`);
                }
              }
              else if (config.midi.inputPort.id === event.port.id && event.port.state === 'disconnected') {
                config.midi.inputPort.onmidimessage = null;
                delete config.midi.inputPort;
                query('.midi-input').text('None');
                browser.console.info(`Midi ${event.port.type} ${event.port.name} is ${event.port.state}`);
              }
            }

            if (event.port.type === 'output') {
              if (config.midi.outputPort === undefined ) {
                if (event.port.state === 'connected') {
                  config.midi.outputPort = event.port;
                  query('.midi-output').text(event.port.name);
                  browser.console.info(`Midi ${event.port.type} ${event.port.name} is ${event.port.state}`);
                }
              }
              else if (config.midi.outputPort.id === event.port.id && event.port.state === 'disconnected') {
                delete config.midi.outputPort;
                query('.midi-output').text('None');
                browser.console.info(`Midi ${event.port.type} ${event.port.name} is ${event.port.state}`);
              }
            }
          };
        };

        var onMidiError = (error) => {
          browser.console.info(`onMidiError error=${error}`);
        };

        navigator.requestMIDIAccess({sysex:false})
          .then(onMidiSuccess, onMidiError);
      }
    });

    resolve();
  });

  applyConfig()
    .then(() => {
      browser.console.info(`Config done`);
    })
    .catch((reason) => {
      browser.console.error(`Error while applying config`);
    });


  /*
   *  Text utility
   */

  function clip(str,length,pad) { return (str.length < length) ? (str) : (str.substr(0,length-pad.length) + pad); }

  function fromFloat(value, elseValue = '0.00') { try { return parseFloat(value); } catch(exp) { return elseValue; } }

  function fromInteger(value, elseValue = '0') { try { return parseInt(value); } catch(exp) { return elseValue; } }

  function stringify(str) { return str.toLowerCase().replace(/\\/g,'_').replace(/ /g,'_').replace(/\./g,'_'); }

  function extractText(text, from, to) {
    if (text.toLowerCase().includes(from.toLowerCase())) {
      const splitText = text.split(from, 2)[1];
      if (splitText.toLowerCase().includes(to.toLowerCase())) {
        return splitText.split(to, 1)[0];
      }
    }
    else {
      return text;
    }
  }

  function parseDate(str) {
    // Try automatic date parsing
    const date = new Date(str);
    if (isNaN(date.getTime()) === false) {
      return date;
    }

    // Perform manual date parsing
    const ts = {
      year: 0, month: 0, day: 0,
      hour:0 , min: 0, sec: 0
    };
    const dateText = str.includes(' ') ? (str.split(' ', 2)[0]) : ('');
    const timeText = str.includes(' ') ? (str.split(' ', 2)[1]) : ('');

    if (dateText.includes('.')) {
      ts.year = parseInt(dateText.split('.')[2]);
      ts.month = parseInt(dateText.split('.')[1]);
      ts.day = parseInt(dateText.split('.')[0]);
    }
    else if (dateText.includes('/'))
    {
      ts.year = parseInt(dateText.split('/')[2]);
      ts.month = parseInt(dateText.split('/')[0]);
      ts.day = parseInt(dateText.split('/')[1]);
    }
  
    const timePartsText = timeText.toLowerCase().split(' ', 2);
    ts.hour = parseInt(timePartsText[0].split(':')[0]);
    ts.min = parseInt(timePartsText[0].split(':')[1]);
    ts.sec = parseInt(timePartsText[0].split(':')[2]);

    if (timePartsText.length > 1) {
       // Handle 12-hour clock
       ts.hour = ts.hour % 12
      if (timePartsText[1] === 'pm') {
        ts.hour = ts.hour + 12;
      }
    }

    // Note: month is specified between 0-11
    return new Date(ts.year, ts.month - 1, ts.day, ts.hour, ts.min, ts.sec);
  }


  /*
   *  DOM util
   */

  function layoutGrid(gridBody, gridElems) {
    let rowgap='',rowheight='';
    gridBody
      .attr('grid-auto-rows', (value) => rowheight = parseInt(value))
      .attr('grid-row-gap', (value) => rowgap = parseInt(value));

    gridElems.each((elem) => {
      let marginBottom='',marginTop='',scrollheight='';
      elem
        .attr('margin-top', (value) => marginTop = parseInt(value))
        .attr('margin-bottom', (value) => marginBottom = parseInt(value));
      elem.prop('scrollHeight', (value) => scrollheight = value);
      elem.attr('grid-row-end', () => 'span ' + Math.ceil((scrollheight + marginTop + marginBottom + rowgap) / (rowheight + rowgap)));
    });
  }

  function parseXml(text) {
    const parser = new DOMParser();
    return parser.parseFromString(text, "application/xml");
  }

  function cssPosition(currentValue, increment, unit) {
    var value = fromInteger(currentValue.replace(unit, ''));
    return `${value + increment}${unit}`;
  }

  function dom(elem) {
    return new ElementSeq([elem]);
  }

  function query(selector) {
    const matches = browser.document.querySelectorAll(selector);
    return new ElementSeq(Array.from(matches));
  }

  function element({type, props, attrs, css, datas}) {
    const elem = browser.document.createElement(type);
    if (props !== undefined) {
      for (const [key, value] of Object.entries(props)) {
        elem[key] = value;
      }
    }
    if (attrs !== undefined) {
      for (const [key, value] of Object.entries(attrs)) {
        elem.style[key] = value;
      }
    }
    if (css !== undefined) {
      elem.classList.add(...css);
    }
    if (datas !== undefined) {
      for (const [key, value] of Object.entries(datas)) {
        elem.dataset[key] = value;
      }
    }
    return new ElementSeq([elem]);
  }

  function div({props,attrs,css,datas}) {
    return element({type:'div', attrs:attrs, props:props, css:css, datas:datas});
  }

  function span({props,attrs,css,datas}) {
    return element({type:'span', attrs:attrs, props:props, css:css, datas:datas});
  }

  function li({props,attrs,css,datas}) {
    return element({type:'li', attrs:attrs, props:props, css:css, datas:datas});
  }
  
})(window, (function(browser) {
  'use strict';

  /*
   *  ElementSeq util
   */

  class ElementSeq {
    constructor(elems) {
      if (elems === undefined) {
        this.elems = [];
      }
      else if (elems === null) {
        throw Error('Constructor parameter elems cannot be null');
      }
      else {
        this.elems = elems;
      }
    }

    append(other) {
      for (const elem of this.elems) {
        for (const otherElem of other.elems) {
          elem.appendChild(otherElem);
        }
      }
      return this;
    }

    css({add, remove}) {
      for (const elem of this.elems) {
        if (remove) {
          elem.classList.remove(...remove);
        }
        if (add) {
          elem.classList.add(...add);
        }
      }
      return this;
    }

    each(fn) {
      for (const elem of this.elems) {
        fn(new ElementSeq([elem]));
      }
      return this;
    }

    empty() {
      for (const elem of this.elems) {
        elem.innerHTML = '';
      }
      return this;
    }

    remove() {
      for (const elem of this.elems) {
        elem.parentNode.removeChild(elem);
      }
      return this;
    }

    size() {
      return this.elems.length;
    }

    prop(key, fn) {
      for (const elem of this.elems) {
        if (fn.length === 0) {
          elem[key] = fn();
        }
        else {
          fn(elem[key]);
        }
      }
      return this;
    }

    attr(key, fn) {
      for (const elem of this.elems) {
        if (fn.length === 0) {
          elem.style[key] = fn();
        }
        else {
          if (elem.style[key] === undefined || elem.style[key] === '') {
            fn(browser.getComputedStyle(elem) ? browser.getComputedStyle(elem)[key] : "");
          }
          else {
            fn(elem.style[key]);
          }
        }
      }
      return this;
    }

    data(key, fn) {
      for (const elem of this.elems) {
        if (fn.length === 0) {
          elem.dataset[key] = fn();
        }
        else {
          fn(elem.dataset[key]);
        }
      }
      return this;
    }

    event(name, fn, options) {
      for (const elem of this.elems) {
        elem.addEventListener(name, fn, (options !== undefined && options !== null) || {});
      }
      return this;
    }

    text(value) {
      for (const elem of this.elems) {
        if (value === undefined) {
          return elem.textContent;
        }
        else {
          elem.textContent = value;
        }
      }
      return this;
    }

    query(selector) {
      const matches = [];
      for (const elem of this.elems) {
        matches.push(Array.from(elem.querySelectorAll(selector)));
      }
      return new ElementSeq([].concat(...matches));
    }
  }

  return ElementSeq;
}(window)),(window, (function(browser) {
  'use strict';

  /*
   *  Synth Fader
   */

  class SynthFader {
    constructor(elem, minValue = -5.1, maxValue = 0.0) {
      if (elem === null || minValue === null || maxValue === null) {
        throw Error('Constructor parameters was null');
      }
      this.elem = elem;
      this.currentValue = maxValue;
      this.minValue = minValue;
      this.maxValue = maxValue;
      this.midiOut = undefined;
    }

    updateValue(dx, dy) {
      var currentValue;
      this.elem.attr('top', () => {
        var newValue = this.currentValue + dy;
        if (newValue < this.minValue) {
          this.currentValue = this.minValue;
        }
        else if (newValue > this.maxValue) {
          this.currentValue = this.maxValue;
        }
        else {
          this.currentValue = newValue;
        }
        return `${this.currentValue}vw`;
      });

      if (this.midiOut !== undefined) {
        var valueRange = Math.abs(this.maxValue - this.minValue);
        var steppedValue = Math.floor((Math.abs(this.currentValue) / valueRange) * 127.0);
        this.midiOut(steppedValue);
      }
    }

    midiIn(fn) {
      var steppedValue = fn();
      var valueRange = Math.abs(this.maxValue - this.minValue);
      var value = -(steppedValue / 127.0) * valueRange;
      this.currentValue = value;
      this.updateValue(0.0, 0.0);
    }
  }

  return SynthFader;
}(window))),(window, (function(browser) {
  'use strict';

  /*
   *  Synth SynthSlider
   */

  class SynthSlider {
    constructor(elem, minValue = 0.0, maxValue = 5.1) {
      if (elem === null || minValue === null || maxValue === null) {
        throw Error('Constructor parameters was null');
      }
      this.elem = elem;
      this.currentValue = minValue;
      this.minValue = minValue;
      this.maxValue = maxValue;
      this.midiOut = undefined;
    }

    updateValue(dx, dy) {
      var currentValue;
      this.elem.attr('left', () => {
        var newValue = this.currentValue + dx;
        if (newValue < this.minValue) {
          this.currentValue = this.minValue;
        }
        else if (newValue > this.maxValue) {
          this.currentValue = this.maxValue;
        }
        else {
          this.currentValue = newValue;
        }
        return `${this.currentValue}vw`;
      });

      if (this.midiOut !== undefined) {
        var valueRange = Math.abs(this.maxValue - this.minValue);
        var steppedValue = Math.floor((Math.abs(this.currentValue) / valueRange) * 127.0);
        this.midiOut(steppedValue);
      }
    }

    midiIn(fn) {
      var steppedValue = fn();
      var valueRange = Math.abs(this.maxValue - this.minValue);
      var value = -(steppedValue / 127.0) * valueRange;
      this.currentValue = value;
      this.updateValue(0.0, 0.0);
    }
  }

  return SynthSlider;
}(window))),(window, (function(browser) {
  'use strict';

  /*
   *  Synth StepRotary
   */

  class SynthSteppedRotary {
    constructor(elem, stepValues = [-75, -45, -15, 15, 45, 75], sensitivity = 0.5) {
      if (elem === null || stepValues === null || sensitivity === null) {
        throw Error('Constructor parameters was null');
      }
      this.elem = elem;
      this.stepValues = stepValues;
      this.currentStep = 0;
      this.stepThreshold = 0.0;
      this.sensitivity = sensitivity;
      this.midiOut = undefined;
    }

    updateValue(dx, dy) {
      this.elem.attr('transform', () => {
        this.stepThreshold = this.stepThreshold - dy;
        if (this.stepThreshold < (-this.sensitivity)) {
          this.currentStep = Math.max(0, this.currentStep - 1);
          this.stepThreshold = 0.0;
        }
        else if (this.stepThreshold > this.sensitivity) {
          this.currentStep = Math.min(this.stepValues.length - 1, this.currentStep + 1);
          this.stepThreshold = 0.0;
        }
        return `rotate(${this.stepValues[this.currentStep]}deg)`;
      });

      if (this.midiOut !== undefined) {
        this.midiOut(this.currentStep);
      }
    }

    midiIn(fn) {
      this.currentStep = fn();
      this.updateValue(0.0, 0.0);
    }
  }

  return SynthSteppedRotary;
}(window))),(window, (function(browser) {
  'use strict';

  /*
   *  Synth IntervalRotary
   */

  class SynthIntervalRotary {
    constructor(elem, minValue = -148.0, maxValue = 148.0, sensitivity = 25.0) {
      if (elem === null || minValue === null || maxValue === null || sensitivity === null) {
        throw Error('Constructor parameters was null');
      }
      this.elem = elem;
      this.value = minValue;
      this.minValue = minValue;
      this.maxValue = maxValue;
      this.sensitivity = sensitivity;
    }

    updateValue(dx, dy) {
      this.elem.attr('transform', () => {
        var newValue = this.value - dy * this.sensitivity;
        if (newValue < this.minValue) {
          this.value = this.minValue;
        }
        else if (newValue > this.maxValue) {
          this.value = this.maxValue;
        }
        else {
          this.value = newValue;
        }
        return `rotate(${this.value}deg)`;
      });

      if (this.midiOut !== undefined) {
        var valueRange = Math.abs(this.maxValue - this.minValue);
        var steppedValue = Math.floor(Math.abs((this.value + Math.abs(this.minValue)) / valueRange) * 127.0);
        this.midiOut(steppedValue);
      }
    }

    midiIn(fn) {
      var steppedValue = fn();
      var valueRange = Math.abs(this.maxValue - this.minValue);
      this.value = -(steppedValue / 127.0) * valueRange - this.minValue;
      this.updateValue(0.0, 0.0);
    }
  }

  return SynthIntervalRotary;
}(window))),(window, (function(browser) {
  'use strict';

  /*
   *  Synth Free Rotary
   */

  class SynthFreeRotary {
    constructor(elem, sensitivity = 0.1) {
      if (elem === null || sensitivity === null) {
        throw Error('Constructor parameters was null');
      }
      this.elem = elem;
      this.currentValue = 0.0;
      this.sensitivity = sensitivity;
    }

    updateValue(dx, dy) {
      this.elem.attr('transform', () => {
        this.currentValue = this.currentValue - dy * this.sensitivity;
        return `rotate(${this.currentValue}deg)`;
      });

      if (this.midiOut !== undefined) {
        var steppedValue = Math.abs(Math.floor(this.currentValue * 127.0)) % 127;
        this.midiOut(steppedValue);
      }
    }

    midiIn(fn) {
      var steppedValue = fn();
      this.currentValue = steppedValue / 127.0;
      this.updateValue(0.0, 0.0);
    }
  }

  return SynthFreeRotary;
}(window))),(window, (function(browser) {
  'use strict';

  /*
   *  Synth Button
   */

  class SynthButton {
    constructor(elem) {
      if (elem === null) {
        throw Error('Constructor parameters was null');
      }
      this.elem = elem;
      this.lightElem = this.elem.query('.synth-button-light');
      this.state = 0;
    }

    updateValue() {
      if (this.state === 0) {
        this.state = 1;
        this.lightElem.attr('backgroundImage', () => { return 'url(./css/svg-shared/control-button-on.svg)' })
      }
      else {
        this.state = 0;
        this.lightElem.attr('backgroundImage', () => { return 'url(./css/svg-shared/control-button-off.svg)' })
      }

      if (this.midiOut !== undefined) {
        this.midiOut(this.state);
      }
    }

    midiIn(fn) {
      this.state = fn();
      this.updateValue(); // TODO: bypass state change 
    }
  }

  return SynthButton;
}(window))),(window, (function(browser) {
  'use strict';

  /*
   *  Synth Switch
   */

  class SynthSwitch {
    constructor(elem) {
      if (elem === null) {
        throw Error('Constructor parameters was null');
      }
      this.elem = elem;
      this.state = 0;
      this.nextState = 3;
      this.midiOut = undefined;
    }

    updateValue() {
      if (this.state === 0) {
        this.state = 1;
        this.nextState = 2;
        this.elem.attr('backgroundImage', () => { return 'url(./css/svg-shared/control-switch-2.svg)' });
      }
      else if (this.state === 1 && this.nextState === 2) {
        this.state = 2;
        this.elem.attr('backgroundImage', () => { return 'url(./css/svg-shared/control-switch-3.svg)' });
      }
      else if (this.state === 1 && this.nextState === 0) {
        this.state = 0;
        this.elem.attr('backgroundImage', () => { return 'url(./css/svg-shared/control-switch-1.svg)' });
      }
      else if (this.state === 2) {
        this.state = 1;
        this.nextState = 0;
        this.elem.attr('backgroundImage', () => { return 'url(./css/svg-shared/control-switch-2.svg)' });
      }

      if (this.midiOut !== undefined) {
        this.midiOut(this.state);
      }
    }

    midiIn(fn) {
      this.state = fn();
      this.updateValue(0.0, 0.0); // TODO: correct for state flip
    }
  }

  return SynthSwitch;
}(window))),(window, (function(browser) {
  'use strict';

  /*
   *  Synth FlipSwitch
   */

  class SynthFlipSwitch {
    constructor(elem) {
      if (elem === null) {
        throw Error('Constructor parameters was null');
      }
      this.elem = elem;
      this.state = 0;
    }

    updateValue() {
      if (this.state === 0) {
        this.state = 1;
        this.elem.attr('backgroundImage', () => { return 'url(./css/svg-shared/control-flipswitch-2.svg)' });
      }
      else if (this.state === 1) {
        this.state = 2;
        this.elem.attr('backgroundImage', () => { return 'url(./css/svg-shared/control-flipswitch-3.svg)' });
      }
      else {
        this.state = 0;
        this.elem.attr('backgroundImage', () => { return 'url(./css/svg-shared/control-flipswitch-1.svg)' });
      }
    }
  }

  return SynthFlipSwitch;
}(window))),(window, (function(browser) {
  'use strict';

  /*
   *  Synth PitchBender
   */

  class SynthPitchBender {
    constructor(elemPitchDown, elemPitchUp, elemPush) {
      this.elemPitchDown = elemPitchDown;
      this.elemPitchUp = elemPitchUp;
      this.elemPush = elemPush;
    }

    bend(velocity) {
      var value = Math.abs(velocity - 8192) / 8192.0;
      if (velocity < 8192) {
        this.elemPitchDown.attr('opacity', () => { return `${value}` });
      }
      else if (velocity > 8192) {
        this.elemPitchUp.attr('opacity', () => { return `${value}` });
      }
      else {
        this.elemPitchUp.attr('opacity', () => { return `0.0` });
        this.elemPitchDown.attr('opacity', () => { return `0.0` });
      }
    }

    push(velocity) {
      var value = velocity / 127.0;
      this.elemPush.attr('opacity', () => { return `${value}` });
    }
  }

  return SynthPitchBender;
}(window))),(window, (function(browser) {
  'use strict';

  /*
   *  Synth Keyboard
   */

  class SynthKeyboard {
    constructor(elems) {
      this.elems = elems;
    }

    noteOn(key, velocity) {
      if (this.elems[key] !== undefined) {
        if (velocity === 0) {
          this.elems[key].css({remove:['down']});
        }
        else {
          this.elems[key].css({add:['down']});
        }
      }
    }

    noteOff(key) {
      if (this.elems[key] !== undefined) {
        this.elems[key].css({remove:['down']});
      }
    }
  }

  return SynthKeyboard;
}(window))),(window, (function(browser) {
  'use strict';

  /*
   *  Midi Util
   */

  class Midi {
    constructor(elem) {
      if (elem === null) {
        throw Error('Constructor parameters was null');
      }
      this.elem = elem;
      this.state = 0;
    }

    static toText(data) {
      var channelMsg = Midi.ccChannelMessage[data[0]];
      if (channelMsg === undefined) {
        return 'unsupported channel message';
      }
      if (channelMsg[0] >= 128 && channelMsg[0] <= 159) {
        return`Ch${channelMsg[6]} ${channelMsg[5]} ${Midi.noteName[data[1]][1]} (${data[2]})`;
      }
      else if (channelMsg[0] >= 160 && channelMsg[0] <= 175) {
        return`Ch${channelMsg[6]} ${channelMsg[5]} (${data[1]})`;
      }
      else if (channelMsg[0] >= 176 && channelMsg[0] <= 191) {
        var controlChange = Midi.ccControlChange[data[1]];
        if (controlChange === undefined) {
          return 'unsupported control change';
        }
        return `Ch${channelMsg[6]} ${controlChange[3]} (${data[2]})`;
      }
      else if (channelMsg[0] >= 208 && channelMsg[0] <= 223) {
        return`Ch${channelMsg[6]} ${channelMsg[5]} (${data[1]})`;
      }
      else if (channelMsg[0] >= 224 && channelMsg[0] <= 239) {
        var word = (data[2] << 7) | (data[1] & 0xf);
        return`Ch${channelMsg[6]} ${channelMsg[5]} (${word})`;
      }
      if (data[1] !== undefined && data[2] !== undefined) {
        return `Ch${channelMsg[6]} ${channelMsg[5]} ${data[1]} (${data[2]})`;
      }
      if (data[1] !== undefined) {
        return `Ch${channelMsg[6]} ${channelMsg[5]} ${data[1]}`;
      }
      return `Ch${channelMsg[6]} ${channelMsg[5]}`;
    }

    static midiChannels = {
       0: [ 0, 'Ch1'],
       1: [ 1, 'Ch2'],
       2: [ 2, 'Ch3'],
       3: [ 3, 'Ch4'],
       4: [ 4, 'Ch5'],
       5: [ 5, 'Ch6'],
       6: [ 6, 'Ch7'],
       7: [ 7, 'Ch8'],
       8: [ 8, 'Ch9'],
       9: [ 9, 'Ch10'],
      10: [10, 'Ch11'],
      11: [11, 'Ch12'],
      12: [12, 'Ch13'],
      13: [13, 'Ch14'],
      14: [14, 'Ch15'],
      15: [15, 'Ch16']
    }

    static ccSystemMessage = {
      248: [248, 0, 0, 0, 0, 'Timing Clock'],
      250: [250, 0, 0, 0, 0, 'Start'],
      252: [252, 0, 0, 0, 0, 'Stop']
    }

    static ccChannelMessage = {
      128: [128, 0, 127, 0, 127, 'Note Off', 1],
      129: [129, 0, 127, 0, 127, 'Note Off', 2],
      130: [130, 0, 127, 0, 127, 'Note Off', 3],
      131: [131, 0, 127, 0, 127, 'Note Off', 4],
      132: [132, 0, 127, 0, 127, 'Note Off', 5],
      133: [133, 0, 127, 0, 127, 'Note Off', 6],
      134: [134, 0, 127, 0, 127, 'Note Off', 7],
      135: [135, 0, 127, 0, 127, 'Note Off', 8],
      136: [136, 0, 127, 0, 127, 'Note Off', 9],
      137: [137, 0, 127, 0, 127, 'Note Off', 10],
      138: [138, 0, 127, 0, 127, 'Note Off', 11],
      139: [139, 0, 127, 0, 127, 'Note Off', 12],
      140: [140, 0, 127, 0, 127, 'Note Off', 13],
      141: [141, 0, 127, 0, 127, 'Note Off', 14],
      142: [142, 0, 127, 0, 127, 'Note Off', 15],
      143: [143, 0, 127, 0, 127, 'Note Off', 16],
      144: [144, 0, 127, 0, 127, 'Note On', 1],
      145: [145, 0, 127, 0, 127, 'Note On', 2],
      146: [146, 0, 127, 0, 127, 'Note On', 3],
      147: [147, 0, 127, 0, 127, 'Note On', 4],
      148: [148, 0, 127, 0, 127, 'Note On', 5],
      149: [149, 0, 127, 0, 127, 'Note On', 6],
      150: [150, 0, 127, 0, 127, 'Note On', 7],
      151: [151, 0, 127, 0, 127, 'Note On', 8],
      152: [152, 0, 127, 0, 127, 'Note On', 9],
      153: [153, 0, 127, 0, 127, 'Note On', 10],
      154: [154, 0, 127, 0, 127, 'Note On', 11],
      155: [155, 0, 127, 0, 127, 'Note On', 12],
      156: [156, 0, 127, 0, 127, 'Note On', 13],
      157: [157, 0, 127, 0, 127, 'Note On', 14],
      158: [158, 0, 127, 0, 127, 'Note On', 15],
      159: [159, 0, 127, 0, 127, 'Note On', 16],
      160: [160, 0, 127, 0, 127, 'Poly Pressure', 1],
      161: [161, 0, 127, 0, 127, 'Poly Pressure', 2],
      162: [162, 0, 127, 0, 127, 'Poly Pressure', 3],
      163: [163, 0, 127, 0, 127, 'Poly Pressure', 4],
      164: [164, 0, 127, 0, 127, 'Poly Pressure', 5],
      165: [165, 0, 127, 0, 127, 'Poly Pressure', 6],
      166: [166, 0, 127, 0, 127, 'Poly Pressure', 7],
      167: [167, 0, 127, 0, 127, 'Poly Pressure', 8],
      168: [168, 0, 127, 0, 127, 'Poly Pressure', 9],
      169: [169, 0, 127, 0, 127, 'Poly Pressure', 10],
      170: [170, 0, 127, 0, 127, 'Poly Pressure', 11],
      171: [171, 0, 127, 0, 127, 'Poly Pressure', 12],
      172: [172, 0, 127, 0, 127, 'Poly Pressure', 13],
      173: [173, 0, 127, 0, 127, 'Poly Pressure', 14],
      174: [174, 0, 127, 0, 127, 'Poly Pressure', 15],
      175: [175, 0, 127, 0, 127, 'Poly Pressure', 16],
      176: [176, 0, 127, 0, 127, 'Control Change', 1],
      177: [177, 0, 127, 0, 127, 'Control Change', 2],
      178: [178, 0, 127, 0, 127, 'Control Change', 3],
      179: [179, 0, 127, 0, 127, 'Control Change', 4],
      180: [180, 0, 127, 0, 127, 'Control Change', 5],
      181: [181, 0, 127, 0, 127, 'Control Change', 6],
      182: [182, 0, 127, 0, 127, 'Control Change', 7],
      183: [183, 0, 127, 0, 127, 'Control Change', 8],
      184: [184, 0, 127, 0, 127, 'Control Change', 9],
      185: [185, 0, 127, 0, 127, 'Control Change', 10],
      186: [186, 0, 127, 0, 127, 'Control Change', 11],
      187: [187, 0, 127, 0, 127, 'Control Change', 12],
      188: [188, 0, 127, 0, 127, 'Control Change', 13],
      189: [189, 0, 127, 0, 127, 'Control Change', 14],
      190: [190, 0, 127, 0, 127, 'Control Change', 15],
      191: [191, 0, 127, 0, 127, 'Control Change', 16],
      192: [192, 0, 127, 0, 127, 'Program Change', 1],
      193: [193, 0, 127, 0, 127, 'Program Change', 2],
      194: [194, 0, 127, 0, 127, 'Program Change', 3],
      195: [195, 0, 127, 0, 127, 'Program Change', 4],
      196: [196, 0, 127, 0, 127, 'Program Change', 5],
      197: [197, 0, 127, 0, 127, 'Program Change', 6],
      198: [198, 0, 127, 0, 127, 'Program Change', 7],
      199: [199, 0, 127, 0, 127, 'Program Change', 8],
      200: [200, 0, 127, 0, 127, 'Program Change', 9],
      201: [201, 0, 127, 0, 127, 'Program Change', 10],
      202: [202, 0, 127, 0, 127, 'Program Change', 11],
      203: [203, 0, 127, 0, 127, 'Program Change', 12],
      204: [204, 0, 127, 0, 127, 'Program Change', 13],
      205: [205, 0, 127, 0, 127, 'Program Change', 14],
      206: [206, 0, 127, 0, 127, 'Program Change', 15],
      207: [207, 0, 127, 0, 127, 'Program Change', 16],
      208: [208, 0, 127, 0, 127, 'Channel Pressure', 1],
      209: [209, 0, 127, 0, 127, 'Channel Pressure', 2],
      210: [210, 0, 127, 0, 127, 'Channel Pressure', 3],
      211: [211, 0, 127, 0, 127, 'Channel Pressure', 4],
      212: [212, 0, 127, 0, 127, 'Channel Pressure', 5],
      213: [213, 0, 127, 0, 127, 'Channel Pressure', 6],
      214: [214, 0, 127, 0, 127, 'Channel Pressure', 7],
      215: [215, 0, 127, 0, 127, 'Channel Pressure', 8],
      216: [216, 0, 127, 0, 127, 'Channel Pressure', 9],
      217: [217, 0, 127, 0, 127, 'Channel Pressure', 10],
      218: [218, 0, 127, 0, 127, 'Channel Pressure', 11],
      219: [219, 0, 127, 0, 127, 'Channel Pressure', 12],
      220: [220, 0, 127, 0, 127, 'Channel Pressure', 13],
      221: [221, 0, 127, 0, 127, 'Channel Pressure', 14],
      222: [222, 0, 127, 0, 127, 'Channel Pressure', 15],
      223: [223, 0, 127, 0, 127, 'Channel Pressure', 16],
      224: [224, 0, 127, 0, 127, 'Pitch Wheel', 1],
      225: [225, 0, 127, 0, 127, 'Pitch Wheel', 2],
      226: [226, 0, 127, 0, 127, 'Pitch Wheel', 3],
      227: [227, 0, 127, 0, 127, 'Pitch Wheel', 4],
      228: [228, 0, 127, 0, 127, 'Pitch Wheel', 5],
      229: [229, 0, 127, 0, 127, 'Pitch Wheel', 6],
      230: [230, 0, 127, 0, 127, 'Pitch Wheel', 7],
      231: [231, 0, 127, 0, 127, 'Pitch Wheel', 8],
      232: [232, 0, 127, 0, 127, 'Pitch Wheel', 9],
      233: [233, 0, 127, 0, 127, 'Pitch Wheel', 10],
      234: [234, 0, 127, 0, 127, 'Pitch Wheel', 11],
      235: [235, 0, 127, 0, 127, 'Pitch Wheel', 12],
      236: [236, 0, 127, 0, 127, 'Pitch Wheel', 13],
      237: [237, 0, 127, 0, 127, 'Pitch Wheel', 14],
      238: [238, 0, 127, 0, 127, 'Pitch Wheel', 15],
      239: [239, 0, 127, 0, 127, 'Pitch Wheel', 16]
    }

    static ccControlChange = {
        0: [  0, 0,   0, 'Bank Select'],
        1: [  1, 0,   0, 'Modulation Lever'],
        3: [  3, 0, 127, 'Tempo'],
        4: [  4, 0,   0, 'Foot Controller'],
        5: [  5, 0,   0, 'Portamento Time'],
        6: [  6, 0,   0, 'Data Entry MSB'],
        7: [  7, 0,   0, 'VCA Env Level'],
       12: [ 12, 0, 127, 'Delay Time'],
       13: [ 13, 0, 127, 'Delay Feedback'],
       14: [ 14, 0,   1, 'Chorus I On'],
       15: [ 15, 0,   1, 'Chorus II On'],
       16: [ 16, 0,   5, 'LFO 1 Waveform/HF Mode'],
       17: [ 17, 0, 127, 'LFO 1 Rate'],
       18: [ 18, 0, 127, 'LFO 1 Delay'],
       19: [ 19, 0, 127, 'LFO 1 L/R Phase'],
       20: [ 20, 0,   1, 'LFO 1 Mode'],
       21: [ 21, 0, 127, 'DDS LFO 1 Amt'],
       22: [ 22, 0, 127, 'DDS Env 1 Amt'],
       23: [ 23, 0,   2, 'DDS Modulator Dest'],
       24: [ 24, 0,   2, 'Super Mode'],
       25: [ 25, 0, 127, 'PW/Detune'],
       26: [ 26, 0, 127, 'PWM/SWM'],
       27: [ 27, 0,   2, 'PWM/SWM Src'],
       28: [ 28, 0, 127, 'Cross Mod'],
       29: [ 29, 0,  21, 'DDS 1 Waveform'],
       30: [ 30, 0,   5, 'DDS 1 Range'],
       31: [ 31, 0,   5, 'DDS 2 Waveform'],
       34: [ 34, 0,   5, 'DDS 2 Range'],
       35: [ 35, 0, 127, 'DDS 2 Tune'],
       36: [ 36, 0,   2, 'DDS 2 Mode'],
       37: [ 37, 0, 127, 'Oscillator Mix/Split Point'],
       38: [ 38, 0, 127, 'LSB for Control 6 (Data Entry)'],
       40: [ 40, 0,   2, 'VCF HPF Mode'],
       41: [ 41, 0,   2, 'VCF Drive'],
       43: [ 43, 0,   2, 'VCF Keytrack'],
       44: [ 44, 0,   2, 'VCF Env Src'],
       45: [ 45, 0, 127, 'VCF Env Amt'],
       46: [ 46, 0, 127, 'VCF LFO 1 Amt'],
       47: [ 47, 0, 127, 'VCF DDS 2 Amt'],
       48: [ 48, 0,   2, 'VCA Dynamics'],
       49: [ 49, 0,   2, 'VCA Env Mode'],
       50: [ 50, 0,   2, 'Env 1 Mode'],
       51: [ 51, 0,   2, 'Env 1 Keytrack'],
       52: [ 52, 0, 127, 'Env 1 Hold'],
       53: [ 53, 0, 127, 'Env 1 Attack'],
       54: [ 54, 0, 127, 'Env 1 Decay'],
       55: [ 55, 0, 127, 'Env 1 Sustain'],
       56: [ 56, 0, 127, 'Env 1 Release'],
       57: [ 57, 0, 127, 'Env 2 Decay'],
       58: [ 58, 0, 127, 'Env 2 Sustain'],
       59: [ 59, 0,   1, 'Manual'],
       60: [ 60, 0,   2, 'LFO 2 Trigger Src'],
       61: [ 61, 0,   2, 'Performance Ctrl Dest'],
       62: [ 62, 0, 127, 'LFO 2 Rate'],
       63: [ 63, 0, 127, 'LFO 2 Delay'],
       64: [ 64, 0,   0, 'Sustain Pedal'],
       70: [ 70, 0, 127, 'DDS LFO 2 Amt'],
       71: [ 71, 0, 127, 'VCF Resonance'],
       72: [ 72, 0, 127, 'Env 2 Release'],
       73: [ 73, 0, 127, 'Env 2 Attack'],
       74: [ 74, 0, 127, 'VCF Cutoff Frequency'],
       75: [ 75, 0, 127, 'VCF LFO 2 Amt'],
       76: [ 76, 0, 127, 'DDS Pitch Bend Amt'],
       77: [ 77, 0, 127, 'VCF Pitch Bend Amt'],
       78: [ 78, 0,   4, 'Voice Assign Mode'],
       79: [ 79, 0,   5, 'Unison Size'],
       80: [ 80, 0,   1, 'Binaural Mode On'],
       81: [ 81, 0,   1, 'Sync'],
       82: [ 82, 0,   3, 'Arp Range'],
       83: [ 83, 0,   4, 'Arp/Seq Swing'],
       85: [ 85, 0,   4, 'Arp/Seq Mode'],
       86: [ 86, 0,   1, 'Arp/Seq On'],
       87: [ 87, 0,   1, 'Hold'],
       89: [ 89, 0,   5, 'Seq Rec Mode'],
       90: [ 90, 0,  63, 'Seq Length'],
       91: [ 91, 0, 127, 'Delay Level'],
       92: [ 92, 0, 127, 'VCA LFO 1 Amt'],
       96: [ 96, 0, 127, 'Data Increment'],
       97: [ 97, 0, 127, 'Data Decrement'],
       98: [ 98, 0, 127, 'Non-Registered Parameter Number (NRPN) - LSB'],
       99: [ 99, 0, 127, 'Non-Registered Parameter Number (NRPN) - MSB'],
      100: [100, 0, 127, 'Registered Parameter Number (RPN) - LSB'],
      101: [101, 0, 127, 'Registered Parameter Number (RPN) - MSB'],
      120: [120, 0,   1, 'All Sound Off'],
      121: [121, 0,   1, 'Reset All Controllers'],
      122: [122, 0,   1, 'Local Control On/Off'],
      123: [123, 0,   1, 'All Notes Off'],
      124: [124, 0,   1, 'Omni Mode Off'],
      125: [125, 0,   1, 'Omni Mode On'],
      126: [126, 0,   1, 'Mono Mode On'],
      127: [127, 0,   1, 'Poly Mode On']
    }

    static nrpnSystemMessage = {
      2048: [2048, 0, 200, 'Master Fine Tune', 'Cents'],
      2049: [2049, 0,  24, 'Master Coarse Tune', 'Semitones'],
      2050: [2050, 0,   4, 'Octave Selector', 'Octaves'],
      2051: [2051, 0,  15, 'MIDI Channel', 'MidiChannel'],
      2052: [2052, 0,   1, 'MIDI Clock Transmit', 'Boolean'],
      2053: [2053, 0,   1, 'MIDI Clock Receive', 'Boolean'],
      2054: [2054, 0,   1, 'Respond To MIDI Start & Stop', 'Boolean'],
      2055: [2055, 0,   3, 'MIDI Controller Transmit', 'MidiController'],
      2056: [2056, 0,   3, 'MIDI Controller Receive', 'MidiController'],
      2057: [2057, 0,   1, 'MIDI Program Change Transmit', 'MidiController'],
      2058: [2058, 0,   1, 'MIDI Program Change Receive', 'MidiController'],
      2059: [2059, 0,   1, 'Local Control', 'Boolean']
    }

    static nrpnControlChange = {
        0: [  0, 0,   5, 'LFO 1 Waveform/HF Mode'],
        1: [  1, 0,  21, 'LFO 1 DDS 1 Waveform'],
        2: [  2, 0, 255, 'LFO 1 Rate'],
        3: [  3, 0, 255, 'LFO 1 Delay'],
        4: [  4, 0, 255, 'LFO 1 L/R Phase'],
        5: [  5, 0,   2, 'LFO 1 Mode'],
        6: [  6, 0, 255, 'DDS LFO 1 Amt'],
        7: [  7, 0, 255, 'DDS Env 1 Amt'],
        8: [  8, 0,   2, 'DDS Modulator Dest'],
        9: [  9, 0,   2, 'Super Mode'],
       10: [ 10, 0, 255, 'PW/Detune'],
       11: [ 11, 0, 255, 'PWM/SWM'],
       12: [ 12, 0,   2, 'PWM/SWM Src'],
       13: [ 13, 0, 255, 'Cross Mod'],
       14: [ 14, 0,  20, 'DDS 1 Waveform'],
       15: [ 15, 0,   5, 'DDS 1 Range'],
       16: [ 16, 0,   5, 'DDS 2 Waveform'],
       17: [ 17, 0,   5, 'DDS 2 Range'],
       18: [ 18, 0, 254, 'DDS 2 Tune'],
       19: [ 19, 0,   2, 'DDS 2 Mode'],
       20: [ 20, 0, 254,'Oscillator Mix/Split Point'],
       21: [ 21, 0,   2, 'VCF HPF Mode'],
       22: [ 22, 0,   2, 'VCF Drive'],
       23: [ 23, 0, 255, 'VCF Cutoff Frequency'],
       24: [ 24, 0, 255, 'VCF Resonance'],
       25: [ 25, 0,   2, 'VCF Keytrack'],
       26: [ 26, 0,   2, 'VCF Env Src'],
       27: [ 27, 0, 255, 'VCF Env Amt'],
       28: [ 28, 0, 255, 'VCF LFO 1 Amt'],
       29: [ 29, 0, 255, 'VCF DDS 2 Amt'],
       30: [ 30, 0,   2, 'VCA Dynamics'],
       31: [ 31, 0,   2, 'VCA Env Mode'],
       32: [ 32, 0, 255, 'VCA Env Level'],
       33: [ 33, 0, 255, 'VCA LFO 1 Amt'],
       34: [ 34, 0,   2, 'Env 1 Mode'],
       35: [ 35, 0,   2, 'Env 1 Keytrack'],
       36: [ 36, 0, 255, 'Env 1 Hold'],
       37: [ 37, 0, 255, 'Env 1 Attack'],
       38: [ 38, 0, 255, 'Env 1 Decay'],
       39: [ 39, 0, 255, 'Env 1 Sustain'],
       40: [ 40, 0, 255, 'Env 1 Release'],
       41: [ 41, 0, 255, 'Env 2 Attack'],
       42: [ 42, 0, 255, 'Env 2 Decay'],
       43: [ 43, 0, 255, 'Env 2 Sustain'],
       44: [ 44, 0, 255, 'Env 2 Release'],
       45: [ 45, 0, 255, 'Portamento Time'],
       46: [ 46, 0,   1, 'Manual'],
       47: [ 47, 0,   2, 'LFO 2 Trigger Src'],
       48: [ 48, 0,   2, 'Performance Ctrl Dest'],
       49: [ 49, 0, 255, 'LFO 2 Rate'],
       50: [ 50, 0, 255, 'LFO 2 Delay'],
       51: [ 51, 0, 255, 'DDS LFO 2 Amt'],
       52: [ 52, 0, 255, 'VCF LFO 2 Amt'],
       53: [ 53, 0, 255, 'DDS Pitch Bend Amt'],
       54: [ 54, 0, 255, 'VCF Pitch Bend Amt'],
       55: [ 55, 0,   4, 'Voice Assign Mode'],
       56: [ 56, 0,   5, 'Unison Size'],
       57: [ 57, 0,   1, 'Binaural Mode On'],
       58: [ 58, 0, 255, 'Delay Level'],
       59: [ 59, 0, 255, 'Delay Time'],
       60: [ 60, 0, 255, 'Delay Feedback'],
       61: [ 61, 0,   1, 'Chorus I On'],
       62: [ 62, 0,   1, 'Chorus II On'],
       63: [ 63, 0, 255, 'Tempo'],
       64: [ 64, 0,   1, 'Sync'],
       65: [ 65, 0,   3, 'Arp Range'],
       66: [ 66, 0,   4, 'Arp/Seq Swing'],
       67: [ 67, 0,   4, 'Arp/Seq Mode'],
       68: [ 68, 0,   1, 'Arp/Seq On'],
       69: [ 69, 0,   1, 'Hold'],
       70: [ 70, 0,   5, 'Seq Rec Mode'],
       71: [ 71, 0,  63, 'Seq Length'],
       72: [ 72, 0,   1, 'Seq Step 1 Slide'],
       73: [ 73, 0,   1, 'Seq Step 2 Slide'],
       74: [ 74, 0,   1, 'Seq Step 3 Slide'],
       75: [ 75, 0,   1, 'Seq Step 4 Slide'],
       76: [ 76, 0,   1, 'Seq Step 5 Slide'],
       77: [ 77, 0,   1, 'Seq Step 6 Slide'],
       78: [ 78, 0,   1, 'Seq Step 7 Slide'],
       79: [ 79, 0,   1, 'Seq Step 8 Slide'],
       80: [ 80, 0,   1, 'Seq Step 9 Slide'],
       81: [ 81, 0,   1, 'Seq Step 10 Slide'],
       82: [ 82, 0,   1, 'Seq Step 11 Slide'],
       83: [ 83, 0,   1, 'Seq Step 12 Slide'],
       84: [ 84, 0,   1, 'Seq Step 13 Slide'],
       85: [ 85, 0,   1, 'Seq Step 14 Slide'],
       86: [ 86, 0,   1, 'Seq Step 15 Slide'],
       87: [ 87, 0,   1, 'Seq Step 16 Slide'],
       88: [ 88, 0,   1, 'Seq Step 17 Slide'],
       89: [ 89, 0,   1, 'Seq Step 18 Slide'],
       90: [ 90, 0,   1, 'Seq Step 19 Slide'],
       91: [ 91, 0,   1, 'Seq Step 20 Slide'],
       92: [ 92, 0,   1, 'Seq Step 21 Slide'],
       93: [ 93, 0,   1, 'Seq Step 22 Slide'],
       94: [ 94, 0,   1, 'Seq Step 23 Slide'],
       95: [ 95, 0,   1, 'Seq Step 24 Slide'],
       96: [ 96, 0,   1, 'Seq Step 25 Slide'],
       97: [ 97, 0,   1, 'Seq Step 26 Slide'],
       98: [ 98, 0,   1, 'Seq Step 27 Slide'],
       99: [ 99, 0,   1, 'Seq Step 28 Slide'],
      100: [100, 0,   1, 'Seq Step 29 Slide'],
      101: [101, 0,   1, 'Seq Step 30 Slide'],
      102: [102, 0,   1, 'Seq Step 31 Slide'],
      103: [103, 0,   1, 'Seq Step 32 Slide'],
      104: [104, 0,   1, 'Seq Step 33 Slide'],
      105: [105, 0,   1, 'Seq Step 34 Slide'],
      106: [106, 0,   1, 'Seq Step 35 Slide'],
      107: [107, 0,   1, 'Seq Step 36 Slide'],
      108: [108, 0,   1, 'Seq Step 37 Slide'],
      109: [109, 0,   1, 'Seq Step 38 Slide'],
      110: [110, 0,   1, 'Seq Step 39 Slide'],
      111: [111, 0,   1, 'Seq Step 40 Slide'],
      112: [112, 0,   1, 'Seq Step 41 Slide'],
      113: [113, 0,   1, 'Seq Step 42 Slide'],
      114: [114, 0,   1, 'Seq Step 43 Slide'],
      115: [115, 0,   1, 'Seq Step 44 Slide'],
      116: [116, 0,   1, 'Seq Step 45 Slide'],
      117: [117, 0,   1, 'Seq Step 46 Slide'],
      118: [118, 0,   1, 'Seq Step 47 Slide'],
      119: [119, 0,   1, 'Seq Step 48 Slide'],
      120: [120, 0,   1, 'Seq Step 49 Slide'],
      121: [121, 0,   1, 'Seq Step 50 Slide'],
      122: [122, 0,   1, 'Seq Step 51 Slide'],
      123: [123, 0,   1, 'Seq Step 52 Slide'],
      124: [124, 0,   1, 'Seq Step 53 Slide'],
      125: [125, 0,   1, 'Seq Step 54 Slide'],
      126: [126, 0,   1, 'Seq Step 55 Slide'],
      127: [127, 0,   1, 'Seq Step 56 Slide'],
      128: [128, 0,   1, 'Seq Step 57 Slide'],
      129: [129, 0,   1, 'Seq Step 58 Slide'],
      130: [130, 0,   1, 'Seq Step 59 Slide'],
      131: [131, 0,   1, 'Seq Step 60 Slide'],
      132: [132, 0,   1, 'Seq Step 61 Slide'],
      133: [133, 0,   1, 'Seq Step 62 Slide'],
      134: [134, 0,   1, 'Seq Step 63 Slide'],
      135: [135, 0,   1, 'Seq Step 64 Slide'],
      136: [136, 0,   1, 'Seq Step 1 Accent'],
      137: [137, 0,   1, 'Seq Step 2 Accent'],
      138: [138, 0,   1, 'Seq Step 3 Accent'],
      139: [139, 0,   1, 'Seq Step 4 Accent'],
      140: [140, 0,   1, 'Seq Step 5 Accent'],
      141: [141, 0,   1, 'Seq Step 6 Accent'],
      142: [142, 0,   1, 'Seq Step 7 Accent'],
      143: [143, 0,   1, 'Seq Step 8 Accent'],
      144: [144, 0,   1, 'Seq Step 9 Accent'],
      145: [145, 0,   1, 'Seq Step 10 Accent'],
      146: [146, 0,   1, 'Seq Step 11 Accent'],
      147: [147, 0,   1, 'Seq Step 12 Accent'],
      148: [148, 0,   1, 'Seq Step 13 Accent'],
      149: [149, 0,   1, 'Seq Step 14 Accent'],
      150: [150, 0,   1, 'Seq Step 15 Accent'],
      151: [151, 0,   1, 'Seq Step 16 Accent'],
      152: [152, 0,   1, 'Seq Step 17 Accent'],
      153: [153, 0,   1, 'Seq Step 18 Accent'],
      154: [154, 0,   1, 'Seq Step 19 Accent'],
      155: [155, 0,   1, 'Seq Step 20 Accent'],
      156: [156, 0,   1, 'Seq Step 21 Accent'],
      157: [157, 0,   1, 'Seq Step 22 Accent'],
      158: [158, 0,   1, 'Seq Step 23 Accent'],
      159: [159, 0,   1, 'Seq Step 24 Accent'],
      160: [160, 0,   1, 'Seq Step 25 Accent'],
      161: [161, 0,   1, 'Seq Step 26 Accent'],
      162: [162, 0,   1, 'Seq Step 27 Accent'],
      163: [163, 0,   1, 'Seq Step 28 Accent'],
      164: [164, 0,   1, 'Seq Step 29 Accent'],
      165: [165, 0,   1, 'Seq Step 30 Accent'],
      166: [166, 0,   1, 'Seq Step 31 Accent'],
      167: [167, 0,   1, 'Seq Step 32 Accent'],
      168: [168, 0,   1, 'Seq Step 33 Accent'],
      169: [169, 0,   1, 'Seq Step 34 Accent'],
      170: [170, 0,   1, 'Seq Step 35 Accent'],
      171: [171, 0,   1, 'Seq Step 36 Accent'],
      172: [172, 0,   1, 'Seq Step 37 Accent'],
      173: [173, 0,   1, 'Seq Step 38 Accent'],
      174: [174, 0,   1, 'Seq Step 39 Accent'],
      175: [175, 0,   1, 'Seq Step 40 Accent'],
      176: [176, 0,   1, 'Seq Step 41 Accent'],
      177: [177, 0,   1, 'Seq Step 42 Accent'],
      178: [178, 0,   1, 'Seq Step 43 Accent'],
      179: [179, 0,   1, 'Seq Step 44 Accent'],
      180: [180, 0,   1, 'Seq Step 45 Accent'],
      181: [181, 0,   1, 'Seq Step 46 Accent'],
      182: [182, 0,   1, 'Seq Step 47 Accent'],
      183: [183, 0,   1, 'Seq Step 48 Accent'],
      184: [184, 0,   1, 'Seq Step 49 Accent'],
      185: [185, 0,   1, 'Seq Step 50 Accent'],
      186: [186, 0,   1, 'Seq Step 51 Accent'],
      187: [187, 0,   1, 'Seq Step 52 Accent'],
      188: [188, 0,   1, 'Seq Step 53 Accent'],
      189: [189, 0,   1, 'Seq Step 54 Accent'],
      190: [190, 0,   1, 'Seq Step 55 Accent'],
      191: [191, 0,   1, 'Seq Step 56 Accent'],
      192: [192, 0,   1, 'Seq Step 57 Accent'],
      193: [193, 0,   1, 'Seq Step 58 Accent'],
      194: [194, 0,   1, 'Seq Step 59 Accent'],
      195: [195, 0,   1, 'Seq Step 60 Accent'],
      196: [196, 0,   1, 'Seq Step 61 Accent'],
      197: [197, 0,   1, 'Seq Step 62 Accent'],
      198: [198, 0,   1, 'Seq Step 63 Accent'],
      199: [199, 0,   1, 'Seq Step 64 Accent'],
      200: [200, 0,   1, 'Seq Step 1 Rest'],
      201: [201, 0,   1, 'Seq Step 2 Rest'],
      202: [202, 0,   1, 'Seq Step 3 Rest'],
      203: [203, 0,   1, 'Seq Step 4 Rest'],
      204: [204, 0,   1, 'Seq Step 5 Rest'],
      205: [205, 0,   1, 'Seq Step 6 Rest'],
      206: [206, 0,   1, 'Seq Step 7 Rest'],
      207: [207, 0,   1, 'Seq Step 8 Rest'],
      208: [208, 0,   1, 'Seq Step 9 Rest'],
      209: [209, 0,   1, 'Seq Step 10 Rest'],
      210: [210, 0,   1, 'Seq Step 11 Rest'],
      211: [211, 0,   1, 'Seq Step 12 Rest'],
      212: [212, 0,   1, 'Seq Step 13 Rest'],
      213: [213, 0,   1, 'Seq Step 14 Rest'],
      214: [214, 0,   1, 'Seq Step 15 Rest'],
      215: [215, 0,   1, 'Seq Step 16 Rest'],
      216: [216, 0,   1, 'Seq Step 17 Rest'],
      217: [217, 0,   1, 'Seq Step 18 Rest'],
      218: [218, 0,   1, 'Seq Step 19 Rest'],
      219: [219, 0,   1, 'Seq Step 20 Rest'],
      220: [220, 0,   1, 'Seq Step 21 Rest'],
      221: [221, 0,   1, 'Seq Step 22 Rest'],
      222: [222, 0,   1, 'Seq Step 23 Rest'],
      223: [223, 0,   1, 'Seq Step 24 Rest'],
      224: [224, 0,   1, 'Seq Step 25 Rest'],
      225: [225, 0,   1, 'Seq Step 26 Rest'],
      226: [226, 0,   1, 'Seq Step 27 Rest'],
      227: [227, 0,   1, 'Seq Step 28 Rest'],
      228: [228, 0,   1, 'Seq Step 29 Rest'],
      229: [229, 0,   1, 'Seq Step 30 Rest'],
      230: [230, 0,   1, 'Seq Step 31 Rest'],
      231: [231, 0,   1, 'Seq Step 32 Rest'],
      232: [232, 0,   1, 'Seq Step 33 Rest'],
      233: [233, 0,   1, 'Seq Step 34 Rest'],
      234: [234, 0,   1, 'Seq Step 35 Rest'],
      235: [235, 0,   1, 'Seq Step 36 Rest'],
      236: [236, 0,   1, 'Seq Step 37 Rest'],
      237: [237, 0,   1, 'Seq Step 38 Rest'],
      238: [238, 0,   1, 'Seq Step 39 Rest'],
      239: [239, 0,   1, 'Seq Step 40 Rest'],
      240: [240, 0,   1, 'Seq Step 41 Rest'],
      241: [241, 0,   1, 'Seq Step 42 Rest'],
      242: [242, 0,   1, 'Seq Step 43 Rest'],
      243: [243, 0,   1, 'Seq Step 44 Rest'],
      244: [244, 0,   1, 'Seq Step 45 Rest'],
      245: [245, 0,   1, 'Seq Step 46 Rest'],
      246: [246, 0,   1, 'Seq Step 47 Rest'],
      247: [247, 0,   1, 'Seq Step 48 Rest'],
      248: [248, 0,   1, 'Seq Step 49 Rest'],
      249: [249, 0,   1, 'Seq Step 50 Rest'],
      250: [250, 0,   1, 'Seq Step 51 Rest'],
      251: [251, 0,   1, 'Seq Step 52 Rest'],
      252: [252, 0,   1, 'Seq Step 53 Rest'],
      253: [253, 0,   1, 'Seq Step 54 Rest'],
      254: [254, 0,   1, 'Seq Step 55 Rest'],
      255: [255, 0,   1, 'Seq Step 56 Rest'],
      256: [256, 0,   1, 'Seq Step 57 Rest'],
      257: [257, 0,   1, 'Seq Step 58 Rest'],
      258: [258, 0,   1, 'Seq Step 59 Rest'],
      259: [259, 0,   1, 'Seq Step 60 Rest'],
      260: [260, 0,   1, 'Seq Step 61 Rest'],
      261: [261, 0,   1, 'Seq Step 62 Rest'],
      262: [262, 0,   1, 'Seq Step 63 Rest'],
      263: [263, 0,   1, 'Seq Step 64 Rest']
    }

    static noteName = {
      127: [127, 'G9',       9],
      126: [126, 'F#9/Gb9',  9],
      125: [125, 'F9',       9],
      124: [124, 'E9',       9],
      123: [123, 'D#9/Eb9',  9],
      122: [122, 'D9',       9],
      121: [121, 'C#9/Db9',  9],
      120: [120, 'C9',       9],
      119: [119, 'B8',       8],
      118: [118, 'A#8/Bb8',  8],
      117: [117, 'A8',       8],
      116: [116, 'G#8/Ab8',  8],
      115: [115, 'G8',       8],
      114: [114, 'F#8/Gb8',  8],
      113: [113, 'F8',       8],
      112: [112, 'E8',       8],
      111: [111, 'D#8/Eb8',  8],
      110: [110, 'D8',       8],
      109: [109, 'C#8/Db8',  8],
      108: [108, 'C8',       8],
      107: [107, 'B7',       7],
      106: [106, 'A#7/Bb7',  7],
      105: [105, 'A7',       7],
      104: [104, 'G#7/Ab7',  7],
      103: [103, 'G7',       7],
      102: [102, 'F#7/Gb7',  7],
      101: [101, 'F7',       7],
      100: [100, 'E7',       7],
       99: [ 99, 'D#7/Eb7',  7],
       98: [ 98, 'D7',       7],
       97: [ 97, 'C#7/Db7',  7],
       96: [ 96, 'C7',       7],
       95: [ 95, 'B6',       6],
       94: [ 94, 'A#6/Bb6',  6],
       93: [ 93, 'A6',       6],
       92: [ 92, 'G#6/Ab6',  6],
       91: [ 91, 'G6',       6],
       90: [ 90, 'F#6/Gb6',  6],
       89: [ 89, 'F6',       6],
       88: [ 88, 'E6',       6],
       87: [ 87, 'D#6/Eb6',  6],
       86: [ 86, 'D6',       6],
       85: [ 85, 'C#6/Db6',  6],
       84: [ 84, 'C6',       6],
       83: [ 83, 'B5',       5],
       82: [ 82, 'A#5/Bb5',  5],
       81: [ 81, 'A5',       5],
       80: [ 80, 'G#5/Ab5',  5],
       79: [ 79, 'G5',       5],
       78: [ 78, 'F#5/Gb5',  5],
       77: [ 77, 'F5',       5],
       76: [ 76, 'E5',       5],
       75: [ 75, 'D#5/Eb5',  5],
       74: [ 74, 'D5',       5],
       73: [ 73, 'C#5/Db5',  5],
       72: [ 72, 'C5',       5],
       71: [ 71, 'B4',       4],
       70: [ 70, 'A#4/Bb4',  4],
       69: [ 69, 'A4',       4],
       68: [ 68, 'G#4/Ab4',  4],
       67: [ 67, 'G4',       4],
       66: [ 66, 'F#4/Gb4',  4],
       65: [ 65, 'F4',       4],
       64: [ 64, 'E4',       4],
       63: [ 63, 'D#4/Eb4',  4],
       62: [ 62, 'D4',       4],
       61: [ 61, 'C#4/Db4',  4],
       60: [ 60, 'C4',       4],
       59: [ 59, 'B3',       3],
       58: [ 58, 'A#3/Bb3',  3],
       57: [ 57, 'A3',       3],
       56: [ 56, 'G#3/Ab3',  3],
       55: [ 55, 'G3',       3],
       54: [ 54, 'F#3/Gb3',  3],
       53: [ 53, 'F3',       3],
       52: [ 52, 'E3',       3],
       51: [ 51, 'D#3/Eb3',  3],
       50: [ 50, 'D3',       3],
       49: [ 49, 'C#3/Db3',  3],
       48: [ 48, 'C3',       3],
       47: [ 47, 'B2',       2],
       46: [ 46, 'A#2/Bb2',  2],
       45: [ 45, 'A2',       2],
       44: [ 44, 'G#2/Ab2',  2],
       43: [ 43, 'G2',       2],
       42: [ 42, 'F#2/Gb2',  2],
       41: [ 41, 'F2',       2],
       40: [ 40, 'E2',       2],
       39: [ 39, 'D#2/Eb2',  2],
       38: [ 38, 'D2',       2],
       37: [ 37, 'C#2/Db2',  2],
       36: [ 36, 'C2',       2],
       35: [ 35, 'B1',       1],
       34: [ 34, 'A#1/Bb1',  1],
       33: [ 33, 'A1',       1],
       32: [ 32, 'G#1/Ab1',  1],
       31: [ 31, 'G1',       1],
       30: [ 30, 'F#1/Gb1',  1],
       29: [ 29, 'F1',       1],
       28: [ 28, 'E1',       1],
       27: [ 27, 'D#1/Eb1',  1],
       26: [ 26, 'D1',       1],
       25: [ 25, 'C#1/Db1',  1],
       24: [ 24, 'C1',       1],
       23: [ 23, 'B0',       0],
       22: [ 22, 'A#0/Bb0',  0],
       21: [ 21, 'A0',       0],
       20: [ 20, 'G#1/Ab0',  0],
       19: [ 19, 'G0',       0],
       18: [ 18, 'F#1/Gb0',  0],
       17: [ 17, 'F0',       0],
       16: [ 16, 'E0',       0],
       15: [ 15, 'D#1/Eb0',  0],
       14: [ 14, 'D0',       0],
       13: [ 13, 'C#1/Db0',	 0],
       12: [ 12, 'C0',       0],
       11: [ 11, 'B-1',     -1],
       10: [ 10, 'A#0/Bb-1',-1],
        9: [  9, 'A-1',     -1],
        8: [  8, 'G#1/Ab-1',-1],
        7: [  7, 'G-1',     -1],
        6: [  6, 'F#1/Gb-1',-1],
        5: [  5, 'F-1',     -1],
        4: [  4, 'E-1',     -1],
        3: [  3, 'D#1/Eb-1',-1],
        2: [  2, 'D-1',     -1],
        1: [  1, 'C#1/Db-1',-1],
        0: [  0, 'C-1',     -1]
    }
  }

  return Midi;
}(window)))
);
