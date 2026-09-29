---
title: Low-cost single-lead ECG for vascular-age prediction
seoTitle: Peer-reviewed ECG vascular-age study
description: >-
  A peer-reviewed Springer study on predicting vascular age from a low-cost single-lead ECG. I co-authored it and built the data, signal and model pipeline.
summary: >-
  Co-authored a peer-reviewed Springer study; contributed data collection, the signal and feature pipeline, and model training and evaluation.
role: >-
  Co-author with equal contribution, third of seven authors. My part: data collection, the signal and feature pipeline, model training and evaluation. Not the ECG hardware.
period: Published 2025
status: >-
  Published in Circuits, Systems, and Signal Processing (Springer), volume 44, issue 8, pages 5852-5875, 2025.
outcome: >-
  Random forest R² 0.99 on 6,131 segmented samples, and R² 0.87 on 42 unsegmented samples with transfer learning.
order: 9
flagship: false
pillar: Applied AI
tracks: [ai-backend]
stack: [Python, Keras, scikit-learn, NeuroKit2, SciPy, random forest, ResNet-18 transfer learning]
problem: >-
  The study asks whether a low-cost single-lead ECG module can predict vascular age, and whether it reveals smoking-induced changes in the ECG. The cohort was 42 apparently healthy subjects aged 18 to 30, 20 of them light but habitual smokers. That is a small cohort, and one lead carries less information than a twelve-lead ECG. Others built the ECG module, so my work starts at the captured signal. The engineering problem was to get a model that means something out of 42 people.
diagram:
  caption: >-
    One recording, from capture to evaluation. I did not build the capture hardware. I collected data and built everything after it.
  nodes:
    - id: signal
      label: Captured signal
      text: >-
        Single-lead ECG from a low-cost module that others built. My work starts at the captured signal; every stage after it inherits its noise.
    - id: clean
      label: Preprocessing
      text: >-
        Cleans the raw signal before anything is measured. A weak cleaning step corrupts every feature after it.
    - id: windows
      label: Segmentation
      text: >-
        Overlapping 5-second windows with a 1-second stride turn 42 samples into 6,131. The windows overlap, so they are not independent.
    - id: features
      label: Features
      text: >-
        21 features: 13 from the ECG, such as intervals and QRS duration, and 8 demographic or clinical. Every interval definition can hide an error.
    - id: models
      label: Models
      text: >-
        Regression baselines, a decision tree, random forest, 1D-CNN and ResNet-18 transfer learning. Random forest was the paper's best model in all three setups.
    - id: eval
      label: Evaluation
      text: >-
        Three setups: segmented, unsegmented, and unsegmented with transfer learning from a public PPG dataset. All three are reported, including the weak one.
  edges: [[signal, clean], [clean, windows], [windows, features], [features, models], [models, eval]]
decisions:
  - title: Segment the recordings
    chose: >-
      Overlapping 5-second windows with a 1-second stride, which turned 42 subject-level samples into 6,131.
    rejected: >-
      Relying on one sample per subject alone, though the paper reports that setup too.
    why: >-
      42 rows is too few to train most models on. Windows give the models thousands of rows to learn from.
    cost: >-
      The windows overlap and come from the same 42 people, so they are not 6,131 independent samples. What broke, below, follows from this.
  - title: Transfer learning for the small set
    chose: >-
      Pre-train on a public PPG dataset, then fine-tune on this ECG data, for the 42-sample set.
    rejected: >-
      Training on the 42 samples alone.
    why: >-
      Alone, the random forest scored R² 0.26. With the pre-training it scored R² 0.87 on the same 42 samples.
    cost: >-
      The result leans on a dataset I did not collect, and 42 people are still 42 people.
  - title: Engineered features and classical models first
    chose: >-
      21 engineered features feeding classical models, with the random forest as the headline model.
    rejected: >-
      A deep network as the headline model, though I implemented a 1D-CNN and ResNet-18 too.
    why: >-
      The random forest was the paper's best model in all three setups, on features I could inspect.
    cost: >-
      Every interval and duration comes from my pipeline, so a mistake there would sit silently under every model.
broke:
  - title: A weak result on the small set
    symptom: >-
      Trained on the 42 unsegmented samples alone, the random forest scored R² 0.26 (MSE 3.56).
    cause: >-
      42 rows, one per person, gave the model too little to learn from.
    fix: >-
      Transfer learning from a public PPG dataset lifted it to R² 0.87 (MSE 0.99) on the same 42 samples. The weak number stays in the paper's table.
  - title: A headline number to read with care
    symptom: >-
      The segmented result, R² 0.99 on 6,131 samples, is the figure people quote, and the one to read with most care.
    cause: >-
      The 6,131 samples are overlapping windows cut from the same 42 people, so they are not 6,131 independent observations.
    fix: >-
      Windowing adds rows, not people, so nothing inside this dataset fixes it. I read R² 0.87 on 42 samples, one per person, as the more conservative figure, and I would want more subjects before trusting either.
results:
  - >-
    Across 42 subjects and 21 features, the random forest reached MSE 0.07 on the 6,131 segmented samples and MSE 0.99 on the 42 unsegmented samples with transfer learning.
  - >-
    I implemented and evaluated ResNet-18 transfer learning as well. The paper prints no accuracy figure for it, so I quote none.
rule:
  n: 9
  text: >-
    Report a result with its sample, or do not report it.
links:
  paper: https://doi.org/10.1007/s00034-025-03048-2
related: [hiretrack, social-signal-intelligence-backend]
---
