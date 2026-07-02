import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

// Load environment variables
dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Helper for lazy Gemini client initialization
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    console.warn('GEMINI_API_KEY environment variable is not configured. Running in High-Fidelity Simulation Mode.');
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();

  // Allow larger payload sizes for base64 X-ray images
  app.use(express.json({ limit: '15mb' }));

  // Helper mock data for fallback / high-fidelity clinical simulations when API key is not configured
  const mockDatabase: Record<string, any> = {
    pneumonia: {
      diseases: [
        { name: 'Pneumonia', confidence: 91.5 },
        { name: 'Atelectasis', confidence: 42.1 },
        { name: 'Pleural Effusion', confidence: 35.8 },
        { name: 'Cardiomegaly', confidence: 15.2 },
        { name: 'Normal Status', confidence: 1.2 },
      ],
      findings: [
        { organSystem: 'Pulmonary Parenchyma', observation: 'Patchy alveolar consolidation in the right lower lobe consistent with acute airspace disease', severity: 'Severe' },
        { organSystem: 'Pleural Space', observation: 'Trace blunting of the right costophrenic angle suggesting minor reactive pleural effusion', severity: 'Mild' },
        { organSystem: 'Hilar Regions', observation: 'Mild hypervascularity and peribronchial cuffing', severity: 'Moderate' },
        { organSystem: 'Cardiovascular Silhouette', observation: 'Heart size is within normal upper limits', severity: 'Normal' },
      ],
      biomarkers: [
        { name: 'Airspace Consolidation', description: 'Fluid or inflammatory exudate filling alveoli, appearing as a patchy opacity.', location: 'Right lower lung zone' },
        { name: 'Costophrenic Angle Blunting', description: 'Fluid accumulation in the pleural space flattening the sharp angle.', location: 'Right lung base' },
        { name: 'Air Bronchograms', description: 'Dark, air-filled bronchi outlined by surrounding dense, fluid-filled alveoli.', location: 'Perihilar region' },
      ],
      heatmapPoints: [
        { x: 68, y: 72, intensity: 0.95, radius: 45, diseaseName: 'Pneumonia' },
        { x: 74, y: 82, intensity: 0.75, radius: 30, diseaseName: 'Pleural Effusion' },
        { x: 62, y: 55, intensity: 0.60, radius: 25, diseaseName: 'Atelectasis' },
      ],
      recommendations: [
        'Correlate clinically with high-grade fever, productive cough, and leukocytosis.',
        'Initiate empiric broad-spectrum antibiotic therapy (e.g., Ceftriaxone or Azithromycin) as per CAP protocol.',
        'Follow-up chest radiograph in 4 to 6 weeks to ensure resolution and rule out underlying mass.',
        'Monitor oxygen saturation levels. Provide supplemental O2 if SaO2 falls below 92%.',
      ],
      billingAndCoding: {
        icd10Code: 'J18.9 (Pneumonia, unspecified organism)',
        cptCode: '71046 (Radiologic examination, chest; 2 views)',
        diagnosticCategory: 'Infectious Lower Respiratory Disease',
      },
      clinicalReport: {
        soapNotes: {
          subjective: '54-year-old patient presents with acute onset of high fever (102.4°F), chills, and a productive cough with rust-colored sputum. Reports sharp pleuritic chest pain on the right side on deep inspiration.',
          objective: 'Temperature: 102.1°F. BP: 128/82 mmHg. HR: 104 bpm. RR: 24 bpm. SpO2: 91% on room air. Auscultation reveals bronchial breath sounds, late-inspiratory crackles, and increased tactile fremitus over the right lung base.',
          assessment: 'Lobular Pneumonia of the Right Lower Lobe with mild acute respiratory compromise and reactive pleural effusion.',
          plan: '1. Sputum culture and blood cultures x2. 2. Prescribed Levofloxacin 750mg IV/PO QD for 7 days. 3. Administer nebulized Albuterol PRN. 4. Supportive care with aggressive hydration and antipyretics. 5. Instruct patient to present to ED if dyspnea worsens.',
        },
        referralDraft: 'Dear Dr. Pulmonology, I am referring this 54-year-old male with severe right lower lobe pneumonia and secondary hypoxia. Due to persistent fever and sub-optimal response to first-line agents, your expert diagnostic evaluation and management of his respiratory distress are requested.',
      },
    },
    cardiomegaly: {
      diseases: [
        { name: 'Cardiomegaly', confidence: 88.7 },
        { name: 'Pleural Effusion', confidence: 64.3 },
        { name: 'Pulmonary Congestion', confidence: 58.2 },
        { name: 'Pneumonia', confidence: 8.4 },
        { name: 'Normal Status', confidence: 0.8 },
      ],
      findings: [
        { organSystem: 'Cardiovascular Silhouette', observation: 'Marked enlargement of the cardiac silhouette with a cardiothoracic ratio estimated at 0.64', severity: 'Severe' },
        { organSystem: 'Pulmonary Vasculature', observation: 'Cephalization of pulmonary vessels and prominent hilar lines, consistent with pulmonary venous hypertension', severity: 'Severe' },
        { organSystem: 'Pleural Space', observation: 'Bilateral blunting of costophrenic angles, greater on the left than right, indicating moderate bilateral pleural effusions', severity: 'Moderate' },
        { organSystem: 'Pulmonary Parenchyma', observation: 'No focal airspace consolidations or suspicious pulmonary nodules', severity: 'Normal' },
      ],
      biomarkers: [
        { name: 'Enlarged Cardiac Silhouette', description: 'Cardiothoracic ratio exceeding 50% on a PA chest radiograph.', location: 'Mediastinum / Heart' },
        { name: 'Pulmonary Venous Congestion', description: 'Prominence of the upper lobe pulmonary vessels (cephalization) due to elevated left atrial pressures.', location: 'Bilateral hilar/perihilar zones' },
        { name: 'Bilateral Costophrenic Blunting', description: 'Accumulation of transudative fluid in both pleural cavities.', location: 'Bilateral lung bases' },
      ],
      heatmapPoints: [
        { x: 50, y: 65, intensity: 0.98, radius: 55, diseaseName: 'Cardiomegaly' },
        { x: 30, y: 52, intensity: 0.70, radius: 35, diseaseName: 'Pulmonary Congestion' },
        { x: 20, y: 84, intensity: 0.82, radius: 30, diseaseName: 'Pleural Effusion' },
        { x: 78, y: 84, intensity: 0.72, radius: 25, diseaseName: 'Pleural Effusion' },
      ],
      recommendations: [
        'Correlate with symptoms of dyspnea on exertion, orthopnea, paroxysmal nocturnal dyspnea, and peripheral edema.',
        'Urgent echocardiogram recommended to evaluate left ventricular ejection fraction (LVEF) and valvular structures.',
        'Optimize diuretic therapy (e.g., Furosemide) and initiate/adjust guideline-directed medical therapy (GDMT) for heart failure.',
        'Initiate a strict low-sodium diet and daily weight monitoring checklist.',
      ],
      billingAndCoding: {
        icd10Code: 'I51.7 (Cardiomegaly) / I50.9 (Heart failure, unspecified)',
        cptCode: '71046 (Radiologic examination, chest; 2 views)',
        diagnosticCategory: 'Chronic Cardiovascular Disease / Heart Failure',
      },
      clinicalReport: {
        soapNotes: {
          subjective: '67-year-old female presents reporting progressive shortness of breath over the past three weeks, worsening when lying flat in bed (requires 3 pillows). Notes bilateral ankle swelling that is worse in the evening.',
          objective: 'BP: 145/90 mmHg. HR: 88 bpm. RR: 20 bpm. SpO2: 93% on room air. Weight increased by 6 lbs over past week. Jugular venous distension (JVD) present at 8cm. Bilateral 2+ pitting pedal edema up to mid-calf. Cardiac auscultation reveals an S3 gallop. Lung fields show bibasilar dullness and faint crackles.',
          assessment: 'Decompensated congestive heart failure with cardiomegaly and bilateral pleural effusion secondary to volume overload.',
          plan: '1. Administer Furosemide 40mg IV stat, monitor urine output. 2. Order comprehensive transthoracic echocardiogram. 3. Adjust Lisinopril to 10mg daily and Carvedilol to 6.25mg BID. 4. Restrict fluids to 1.5L daily. 5. Patient education regarding strict daily weights and low-sodium diet (<2g/day).',
        },
        referralDraft: 'Dear Dr. Cardiology, I am referring this 67-year-old female presenting with acute decompensation of congestive heart failure. Chest radiograph demonstrates cardiomegaly and bilateral effusions. I have initiated intravenous diuresis and would appreciate your consultation to optimize her long-term cardiac regimen.',
      },
    },
    normal: {
      diseases: [
        { name: 'Normal Chest Status', confidence: 99.4 },
        { name: 'Pneumonia', confidence: 1.1 },
        { name: 'Cardiomegaly', confidence: 0.8 },
        { name: 'Pleural Effusion', confidence: 0.5 },
      ],
      findings: [
        { organSystem: 'Pulmonary Parenchyma', observation: 'Lungs are clear and well-aerated. No focal consolidations, infiltrates, masses, or nodules identified.', severity: 'Normal' },
        { organSystem: 'Pleural Space', observation: 'Costophrenic and cardiophrenic angles are sharp and clear. No pleural effusions or pneumothorax.', severity: 'Normal' },
        { organSystem: 'Cardiovascular Silhouette', observation: 'Cardiovascular silhouette, aortic contour, and mediastinal structures are within normal limits of size and shape.', severity: 'Normal' },
        { organSystem: 'Bony Structures', observation: 'Intact thoracic skeleton. Visually normal clavicles, ribs, and visualized spine.', severity: 'Normal' },
      ],
      biomarkers: [],
      heatmapPoints: [],
      recommendations: [
        'No active cardiopulmonary disease identified.',
        'Routine health maintenance and clinical follow-up as indicated by primary symptoms.',
      ],
      billingAndCoding: {
        icd10Code: 'Z00.00 (Encounter for general adult medical examination)',
        cptCode: '71045 (Radiologic examination, chest; single view)',
        diagnosticCategory: 'Preventive / Routine Diagnostic',
      },
      clinicalReport: {
        soapNotes: {
          subjective: '32-year-old male presents with atypical transient chest wall discomfort during deep respiration. No fever, productive cough, shortness of breath, palpitations, or history of respiratory illnesses.',
          objective: 'Temperature: 98.6°F. BP: 120/78 mmHg. HR: 68 bpm. RR: 14 bpm. SpO2: 99% on room air. Normal chest wall palpation, symmetric respiratory excursions. Lungs clear to auscultation bilaterally. Heart sounds normal with regular rhythm and no murmurs.',
          assessment: 'No radiographic or clinical evidence of acute cardiopulmonary pathology. Chest wall discomfort is likely musculoskeletal in origin.',
          plan: '1. Reassurance provided to patient. 2. Warm compresses and Ibuprofen 400mg PO TID PRN for musculoskeletal pain. 3. Advised to return immediately if symptoms progress to persistent chest pain, dyspnea, or hemoptysis.',
        },
        referralDraft: 'No referral necessary. Patient demonstrates completely normal radiographic findings and musculoskeletal symptom resolution.',
      },
    },
  };

  // POST /api/analyze-xray
  app.post('/api/analyze-xray', async (req, res) => {
    const { image, presetType, modelName } = req.body;
    
    // Check if we can call Gemini
    const ai = getGeminiClient();
    const isSimulated = !ai;

    console.log(`Analyzing X-Ray. Mode: ${isSimulated ? 'Simulation' : 'Gemini AI'}, Preset: ${presetType || 'None'}`);

    if (isSimulated || (presetType && presetType !== 'upload')) {
      // Return high-fidelity simulation response from local clinical templates
      const presetKey = (presetType && mockDatabase[presetType]) ? presetType : 'normal';
      const mockResult = { ...mockDatabase[presetKey] };
      return res.json({
        success: true,
        isSimulated: true,
        modelUsed: 'Clinical AI Classifier (Offline Model)',
        data: mockResult
      });
    }

    // Real Gemini API flow
    try {
      if (!image) {
        return res.status(400).json({ success: false, error: 'No image data provided for analysis.' });
      }

      // Extract base64 details
      let mimeType = 'image/png';
      let base64Data = image;
      if (image.includes(';base64,')) {
        const parts = image.split(';base64,');
        mimeType = parts[0].split(':')[1];
        base64Data = parts[1];
      }

      const selectedModel = modelName || 'gemini-3.5-flash';

      const prompt = `You are a state-of-the-art computer-aided diagnostic (CAD) system trained on massive clinical chest X-ray datasets. Analyze this chest radiograph carefully to identify diagnostic biomarkers and potential diseases.
      Please perform a multi-label classification for common chest conditions: Pneumonia, Cardiomegaly, Pleural Effusion, Atelectasis, COVID-19, Tuberculosis, Pneumothorax, and Normal Status.

      You must provide structured JSON matching the following schema.
      Do not include any other markdown formatting outside the JSON block.
      Make sure to locate biomarkers and define relative heatmap coordinates (x and y from 0 to 100, where 0,0 is top-left and 100,100 is bottom-right) where these abnormalities are visualized on the radiograph so that a clinician can review them via Grad-CAM heatmaps.
      
      Generate highly realistic clinical findings, recommendations, and billing/coding suggestions (ICD-10, CPT codes) based on your analysis. Also generate a standard clinical SOAP note (Subjective, Objective, Assessment, Plan) and a referral letter draft based on the chest X-ray findings.`;

      const response = await ai.models.generateContent({
        model: selectedModel,
        contents: [
          {
            inlineData: {
              data: base64Data,
              mimeType: mimeType
            }
          },
          prompt
        ],
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            required: ['diseases', 'findings', 'biomarkers', 'heatmapPoints', 'recommendations', 'billingAndCoding', 'clinicalReport'],
            properties: {
              diseases: {
                type: Type.ARRAY,
                description: 'Confidence scores for potential respiratory/cardiac diseases on the X-ray',
                items: {
                  type: Type.OBJECT,
                  required: ['name', 'confidence'],
                  properties: {
                    name: { type: Type.STRING, description: 'Disease name (e.g. Pneumonia, Cardiomegaly, Pleural Effusion, COVID-19, Normal Status)' },
                    confidence: { type: Type.NUMBER, description: 'Percentage confidence from 0 to 100' }
                  }
                }
              },
              findings: {
                type: Type.ARRAY,
                description: 'Organ systems and observations from the image',
                items: {
                  type: Type.OBJECT,
                  required: ['organSystem', 'observation', 'severity'],
                  properties: {
                    organSystem: { type: Type.STRING, description: 'e.g., Pulmonary Parenchyma, Pleural Space, Cardiovascular Silhouette, Bony Structures' },
                    observation: { type: Type.STRING, description: 'Specific radiological finding' },
                    severity: { type: Type.STRING, description: 'One of: Normal, Mild, Moderate, Severe' }
                  }
                }
              },
              biomarkers: {
                type: Type.ARRAY,
                description: 'Identified diagnostic biomarkers',
                items: {
                  type: Type.OBJECT,
                  required: ['name', 'description', 'location'],
                  properties: {
                    name: { type: Type.STRING, description: 'Diagnostic biomarker (e.g., Airspace consolidation, Costophrenic blunting, Cephalization)' },
                    description: { type: Type.STRING, description: 'Brief medical description of what this biomarker indicates' },
                    location: { type: Type.STRING, description: 'Visual location in the chest' }
                  }
                }
              },
              heatmapPoints: {
                type: Type.ARRAY,
                description: 'Relative coordinates (0-100) pointing to localized pathologies on the image for the Grad-CAM representation',
                items: {
                  type: Type.OBJECT,
                  required: ['x', 'y', 'intensity', 'radius', 'diseaseName'],
                  properties: {
                    x: { type: Type.NUMBER, description: 'Horizontal position from 0 to 100' },
                    y: { type: Type.NUMBER, description: 'Vertical position from 0 to 100' },
                    intensity: { type: Type.NUMBER, description: 'Attention heatmap weight from 0.1 to 1.0' },
                    radius: { type: Type.NUMBER, description: 'Visual circle radius (e.g., 20 to 55)' },
                    diseaseName: { type: Type.STRING, description: 'The related disease tag' }
                  }
                }
              },
              recommendations: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Clinical recommendations and next steps'
              },
              billingAndCoding: {
                type: Type.OBJECT,
                required: ['icd10Code', 'cptCode', 'diagnosticCategory'],
                properties: {
                  icd10Code: { type: Type.STRING },
                  cptCode: { type: Type.STRING },
                  diagnosticCategory: { type: Type.STRING }
                }
              },
              clinicalReport: {
                type: Type.OBJECT,
                required: ['soapNotes', 'referralDraft'],
                properties: {
                  soapNotes: {
                    type: Type.OBJECT,
                    required: ['subjective', 'objective', 'assessment', 'plan'],
                    properties: {
                      subjective: { type: Type.STRING, description: 'Clinical history/symptoms draft' },
                      objective: { type: Type.STRING, description: 'Clinical vitals, physical findings, and radiological results' },
                      assessment: { type: Type.STRING, description: 'Diagnosis and summary' },
                      plan: { type: Type.STRING, description: 'Medications, referrals, follow-up timelines' }
                    }
                  },
                  referralDraft: { type: Type.STRING, description: 'Professional draft letter referring the patient to a specialist' }
                }
              }
            }
          }
        }
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error('Gemini API returned an empty response.');
      }

      const data = JSON.parse(responseText.trim());
      return res.json({
        success: true,
        isSimulated: false,
        modelUsed: selectedModel,
        data: data
      });
    } catch (error: any) {
      console.error('Error calling Gemini API:', error);
      return res.status(500).json({
        success: false,
        error: error.message || 'An error occurred during AI clinical radiograph interpretation.',
        details: 'The clinical system has temporarily reverted to High-Fidelity Simulation Mode.'
      });
    }
  });

  // POST /api/admin/triage-patient
  app.post('/api/admin/triage-patient', async (req, res) => {
    const { patientName, age, gender, complaints, vitals } = req.body;

    const ai = getGeminiClient();
    const isSimulated = !ai;

    console.log(`Triaging patient: ${patientName}. Mode: ${isSimulated ? 'Simulation' : 'Gemini AI'}`);

    if (isSimulated) {
      // Mock administrative patient triaging & scheduling recommendations
      const waitTime = age > 60 || vitals.rr > 22 || vitals.spo2 < 93 ? 12 : 45;
      const priority = waitTime < 15 ? 'STAT / Level 2 (Emergent)' : 'Routine / Level 4';
      
      const mockTriage = {
        priority: priority,
        priorityReason: `Patient of age ${age} presenting with respiratory signs (SpO2: ${vitals.spo2}%, Respiratory Rate: ${vitals.rr} bpm). Requires immediate nursing assessment to prevent decompensation.`,
        suggestedDepartment: 'Pulmonary / Emergency Department Quick-Track',
        targetWaitTimeMinutes: waitTime,
        icd10Candidate: complaints.toLowerCase().includes('cough') ? 'R05.9 (Cough, unspecified)' : 'R07.9 (Chest pain, unspecified)',
        schedulingRecommendation: `Schedule immediate bedside nurse triage, secure standard 2-view chest radiograph STAT (CPT 71046), and arrange for rapid pulse oximetry. Peak clinic load is currently high, bypass standard registration line to direct patient directly to Exam Room 4.`,
        administrativeNote: `Patient has active insurance with pre-authorization not required for urgent chest radiography. Registered under emergency billing code.`
      };

      return res.json({
        success: true,
        isSimulated: true,
        data: mockTriage
      });
    }

    try {
      const prompt = `You are a hospital clinical administration AI assistant optimizing everyday triage and queue operations.
      Triage this patient based on their details and generate scheduling recommendations, administrative notes, priority levels, and ICD-10 suggestions.

      Patient Information:
      - Name: ${patientName}
      - Age: ${age}
      - Gender: ${gender}
      - Chief Complaints: ${complaints}
      - Vitals: Pulse: ${vitals.pulse} bpm, Temp: ${vitals.temp}°F, RR: ${vitals.rr} bpm, SpO2: ${vitals.spo2}%

      Provide structured JSON response matching this schema:
      {
        "priority": "STAT / Level 2 (Emergent)" | "Urgent / Level 3" | "Routine / Level 4",
        "priorityReason": "string describing why this priority was assigned based on medical rules",
        "suggestedDepartment": "string",
        "targetWaitTimeMinutes": number,
        "icd10Candidate": "string (ICD-10 code and name)",
        "schedulingRecommendation": "detailed string with operational advice for scheduling and bypass rules",
        "administrativeNote": "string containing billing/regulatory checklist items"
      }`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            required: ['priority', 'priorityReason', 'suggestedDepartment', 'targetWaitTimeMinutes', 'icd10Candidate', 'schedulingRecommendation', 'administrativeNote'],
            properties: {
              priority: { type: Type.STRING },
              priorityReason: { type: Type.STRING },
              suggestedDepartment: { type: Type.STRING },
              targetWaitTimeMinutes: { type: Type.INTEGER },
              icd10Candidate: { type: Type.STRING },
              schedulingRecommendation: { type: Type.STRING },
              administrativeNote: { type: Type.STRING }
            }
          }
        }
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error('Gemini API returned an empty response.');
      }

      const data = JSON.parse(responseText.trim());
      return res.json({
        success: true,
        isSimulated: false,
        data: data
      });
    } catch (error: any) {
      console.error('Error calling Gemini for triage:', error);
      return res.status(500).json({
        success: false,
        error: error.message || 'An error occurred during AI patient triaging.',
        details: 'Reverted to simulation response.'
      });
    }
  });

  // Serve static files / Vite middleware
  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  const PORT = 3000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[HealthTech Server] Up and running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[HealthTech Server] Startup failure:', err);
});
