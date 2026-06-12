import React, { useState, useEffect, useRef } from 'react'
import '../style/interview.scss'
import { useInterview } from '../hooks/useInterview.js'
import { useAuth } from '../../auth/hooks/useAuth.js'
import { useNavigate, useParams } from 'react-router'

const LiveCamera = ({ userName }) => {
    const videoRef = useRef(null);
    const [stream, setStream] = useState(null);
    const [micEnabled, setMicEnabled] = useState(true);
    const [videoEnabled, setVideoEnabled] = useState(true);
    const [permissionError, setPermissionError] = useState(null);

    useEffect(() => {
        let activeStream = null;
        async function startCamera() {
            try {
                const mediaStream = await navigator.mediaDevices.getUserMedia({ 
                    video: { width: 640, height: 360 }, 
                    audio: true 
                });
                if (videoRef.current) {
                    videoRef.current.srcObject = mediaStream;
                }
                setStream(mediaStream);
                activeStream = mediaStream;
            } catch (err) {
                console.error("Error accessing webcam/microphone:", err);
                setPermissionError(err.message || "Permission denied or media devices unavailable.");
            }
        }
        startCamera();

        return () => {
            if (activeStream) {
                activeStream.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    const toggleMic = () => {
        if (stream) {
            stream.getAudioTracks().forEach(track => {
                track.enabled = !micEnabled;
            });
            setMicEnabled(!micEnabled);
        }
    };

    const toggleVideo = () => {
        if (stream) {
            stream.getVideoTracks().forEach(track => {
                track.enabled = !videoEnabled;
            });
            setVideoEnabled(!videoEnabled);
        }
    };

    return (
        <div className="webcam-card">
            {permissionError ? (
                <div className="webcam-placeholder">
                    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"/><line x1="2" y1="2" x2="22" y2="22"/><path d="M7 7a5 5 0 0 0 5 5m1.7-1.7A5 5 0 0 0 17 7"/><path d="M23 7a2 2 0 0 0-2.45-1.45L16 7V5a2 2 0 0 0-2-2H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2l4.55 1.45A2 2 0 0 0 23 17V7z"/></svg>
                    <p style={{ marginTop: '0.5rem', fontSize: '0.75rem', maxWidth: '80%', color: 'var(--text-muted)' }}>Camera and Microphone access are required to record this interview session.</p>
                </div>
            ) : (
                <>
                    <video ref={videoRef} autoPlay playsInline muted className="webcam-video" />
                    <div className="webcam-overlay">
                        <div className="webcam-identity">{userName || "Candidate"} (You)</div>
                        <div className="webcam-badge">
                            <span className="dot" style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', backgroundColor: '#fff' }} />
                            LIVE
                        </div>
                        <div className="webcam-controls">
                            <button className={`webcam-ctrl-btn ${micEnabled ? 'webcam-ctrl-btn--active' : ''}`} onClick={toggleMic} title={micEnabled ? "Mute Microphone" : "Unmute Microphone"}>
                                {micEnabled ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v1a7 7 0 0 1-14 0v-1"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="2" y1="2" x2="22" y2="22"/><path d="M18.89 13.23A7.12 7.12 0 0 0 19 11v-1M5 10v1a7 7 0 0 0 7 7c2 0 3.86-.83 5.2-2.18M12 18.75V22M9 22h6M12 2a3 3 0 0 0-3 3v2a3 3 0 0 0 .15.93M15 11.23a3 3 0 0 1-2.85 2.75M9.34 3.7A3 3 0 0 1 12 2"/></svg>
                                )}
                            </button>
                            <button className={`webcam-ctrl-btn ${videoEnabled ? 'webcam-ctrl-btn--active' : ''}`} onClick={toggleVideo} title={videoEnabled ? "Turn Camera Off" : "Turn Camera On"}>
                                {videoEnabled ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 7a2 2 0 0 0-2.45-1.45L16 7V5a2 2 0 0 0-2-2H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2l4.55 1.45A2 2 0 0 0 23 17V7z"/></svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="2" y1="2" x2="22" y2="22"/><path d="m16 16 3 3 3-3"/><path d="M19 19v-6M2 10V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v5M2 14v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5M23 7v10"/></svg>
                                )}
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

const NAV_ITEMS = [
    { id: 'technical', label: 'Technical Questions', icon: (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>) },
    { id: 'behavioral', label: 'Behavioral Questions', icon: (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>) },
    { id: 'roadmap', label: 'Road Map', icon: (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11" /></svg>) },
    { id: 'mock', label: 'Mock Interview', icon: (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v1a7 7 0 0 1-14 0v-1"/><line x1="12" x2="12" y1="19" y2="22"/></svg>) },
    { id: 'sandbox', label: 'Coding Sandbox', icon: (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 17l6-6-6-6M12 19h8"/></svg>) },
]

// ── Sub-components ────────────────────────────────────────────────────────────
const QuestionCard = ({ item, index }) => {
    const [ open, setOpen ] = useState(false)
    const [ prepared, setPrepared ] = useState(false)

    return (
        <div className={`q-card ${prepared ? 'q-card--prepared' : ''} ${open ? 'q-card--open' : ''}`}>
            <div className='q-card__header' onClick={() => setOpen(o => !o)}>
                <span className='q-card__index'>Q{index + 1}</span>
                <div className='q-card__question-wrapper'>
                    <p className='q-card__question'>{item.question}</p>
                    {item.tags && item.tags.length > 0 && (
                        <div className='q-card__tags-list'>
                            {item.tags.map((tag, idx) => (
                                <span key={idx} className='q-card__question-tag'>{tag}</span>
                            ))}
                        </div>
                    )}
                </div>
                
                {/* Prepared toggle */}
                <button 
                    type="button" 
                    className={`q-card__prepared-btn ${prepared ? 'q-card__prepared-btn--active' : ''}`}
                    onClick={(e) => {
                        e.stopPropagation()
                        setPrepared(!prepared)
                    }}
                    title={prepared ? "Mark as unprepared" : "Mark as prepared"}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    {prepared ? "Prepared" : "Prepare"}
                </button>

                <span className={`q-card__chevron ${open ? 'q-card__chevron--open' : ''}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
                </span>
            </div>
            {open && (
                <div className='q-card__body'>
                    <div className='q-card__section'>
                        <span className='q-card__tag q-card__tag--intention'>Intention</span>
                        <p>{item.intention}</p>
                    </div>
                    <div className='q-card__section'>
                        <span className='q-card__tag q-card__tag--answer'>Model Answer</span>
                        <p>{item.answer}</p>
                    </div>
                </div>
            )}
        </div>
    )
}

const RoadMapDay = ({ day }) => {
    // Keep track of which tasks are checked for this day
    const [checkedTasks, setCheckedTasks] = useState({})

    const handleToggleTask = (idx) => {
        setCheckedTasks(prev => ({
            ...prev,
            [idx]: !prev[idx]
        }))
    }

    const tasks = day.tasks || []

    return (
        <div className='roadmap-day'>
            <div className='roadmap-day__header'>
                <span className='roadmap-day__badge'>Day {day.day}</span>
                <h3 className='roadmap-day__focus'>{day.focus}</h3>
            </div>
            <ul className='roadmap-day__tasks'>
                {tasks.map((task, i) => (
                    <li 
                        key={i} 
                        className={`roadmap-day__task-item ${checkedTasks[i] ? 'roadmap-day__task-item--checked' : ''}`}
                        onClick={() => handleToggleTask(i)}
                    >
                        <div className='roadmap-day__checkbox'>
                            {checkedTasks[i] && (
                                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                            )}
                        </div>
                        <span className='roadmap-day__task-text'>{task}</span>
                    </li>
                ))}
            </ul>
        </div>
    )
}

const MockInterview = ({ interviewId, useInterviewHook }) => {
    const { 
        loading, 
        mockSession, 
        startMock, 
        fetchMock, 
        submitAnswer 
    } = useInterviewHook;

    const [answerText, setAnswerText] = useState("");
    const [isListening, setIsListening] = useState(false);
    const [recognition, setRecognition] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [selectedQuestionIdx, setSelectedQuestionIdx] = useState(null);

    useEffect(() => {
        fetchMock(interviewId);
    }, [interviewId]);

    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            const rec = new SpeechRecognition();
            rec.continuous = true;
            rec.interimResults = true;
            rec.lang = 'en-US';

            rec.onresult = (event) => {
                let text = "";
                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    text += event.results[i][0].transcript;
                }
                setAnswerText(prev => prev + " " + text);
            };

            rec.onerror = (e) => {
                console.error("Speech recognition error:", e);
                setIsListening(false);
            };

            rec.onend = () => {
                setIsListening(false);
            };

            setRecognition(rec);
        }
    }, []);

    const toggleListening = () => {
        if (!recognition) {
            alert("Speech recognition is not supported in this browser. Please type your answer.");
            return;
        }
        if (isListening) {
            recognition.stop();
            setIsListening(false);
        } else {
            recognition.start();
            setIsListening(true);
        }
    };

    const handleStartMock = async () => {
        await startMock(interviewId);
        setAnswerText("");
    };

    const handleSubmitAnswer = async () => {
        if (!answerText.trim()) {
            alert("Please provide an answer before submitting.");
            return;
        }
        if (isListening) {
            recognition.stop();
            setIsListening(false);
        }
        setSubmitting(true);
        try {
            await submitAnswer(interviewId, answerText.trim());
            setAnswerText("");
        } catch (err) {
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading && !mockSession) {
        return (
            <div className="mock-container">
                <div className="mock-loading">Loading mock interview room...</div>
            </div>
        );
    }

    if (!mockSession) {
        return (
            <div className="mock-start-screen">
                <div className="mock-card">
                    <div className="mock-icon-wrapper">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v1a7 7 0 0 1-14 0v-1"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
                    </div>
                    <h3>Start Mock Interview Room</h3>
                    <p>Simulate a real technical/behavioral interview. Gemini AI will ask you exactly 5 questions tailored to your target job profile, record your answers, and provide detailed score reviews and recommendations.</p>
                    <button className="button primary-button" onClick={handleStartMock}>
                        Generate & Start Session
                    </button>
                </div>
            </div>
        );
    }

    const { questions, currentQuestionIndex, status } = mockSession;

    if (status === "completed") {
        const scores = questions.map(q => q.feedback ? q.feedback.score : 0);
        const avgScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);

        return (
            <div className="mock-completed-screen">
                <div className="mock-completed-header">
                    <div className="score-badge-circle">
                        <span className="score-val">{avgScore}</span>
                        <span className="score-max">/100</span>
                    </div>
                    <div className="completed-info">
                        <h2>Mock Interview Completed!</h2>
                        <p>Below is a question-by-question breakdown of your answers, strengths, and suggested areas of improvement.</p>
                    </div>
                    <button className="button secondary-button retake-btn" onClick={handleStartMock}>
                        Retake Interview
                    </button>
                </div>

                <div className="mock-review-list">
                    {questions.map((q, idx) => (
                        <div key={idx} className={`q-review-card ${selectedQuestionIdx === idx ? 'q-review-card--open' : ''}`}>
                            <div className="q-review-header" onClick={() => setSelectedQuestionIdx(selectedQuestionIdx === idx ? null : idx)}>
                                <span className={`category-tag category-tag--${q.category}`}>{q.category}</span>
                                <p className="q-review-question">{q.question}</p>
                                <div className="q-review-header-right">
                                    <span className="q-review-score">{q.feedback ? q.feedback.score : 0}/100</span>
                                    <span className={`chevron ${selectedQuestionIdx === idx ? 'chevron--open' : ''}`}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
                                    </span>
                                </div>
                            </div>

                            {selectedQuestionIdx === idx && (
                                <div className="q-review-body">
                                    <div className="q-review-section">
                                        <h4>Your Answer:</h4>
                                        <p className="user-answer-text">{q.userAnswer || "No answer provided."}</p>
                                    </div>
                                    <div className="q-review-row">
                                        <div className="q-review-col green-border">
                                            <h4>Strengths:</h4>
                                            <p>{q.feedback?.strengths || "N/A"}</p>
                                        </div>
                                        <div className="q-review-col orange-border">
                                            <h4>Areas for Improvement:</h4>
                                            <p>{q.feedback?.improvements || "N/A"}</p>
                                        </div>
                                    </div>
                                    <div className="q-review-section model-ans">
                                        <h4>Model Answer:</h4>
                                        <p>{q.feedback?.modelAnswer || "N/A"}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    const currentQuestion = questions[currentQuestionIndex];

    return (
        <div className="mock-session-active">
            <div className="mock-split-pane">
                {/* Left Panel: Camera Stream and Bot details */}
                <div className="camera-feed-panel">
                    <LiveCamera userName={useInterviewHook.report?.user?.username || "Candidate"} />
                    <div className="live-interviewer-card">
                        <h4>Interviewer: AI Assistant</h4>
                        <p>Simulating a live technical/behavioral interview. I am listening to your answers. Provide structured responses covering practical engineering practices.</p>
                    </div>
                </div>

                {/* Right Panel: Chat interface and Answer console */}
                <div className="mock-chat-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', width: '100%' }}>
                    <div className="mock-session-progress">
                        <span className="progress-text">Question {currentQuestionIndex + 1} of {questions.length}</span>
                        <div className="progress-bar-container">
                            <div className="progress-bar-fill" style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}></div>
                        </div>
                    </div>

                    <div className="mock-question-panel">
                        <div className="bot-avatar">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
                        </div>
                        <div className="mock-question-bubble">
                            <span className="question-cat">{currentQuestion.category} Question</span>
                            <p className="question-text">{currentQuestion.question}</p>
                        </div>
                    </div>

                    <div className="mock-input-panel">
                        <textarea 
                            className="mock-textarea"
                            placeholder="Type or dictate your answer here..."
                            value={answerText}
                            onChange={(e) => setAnswerText(e.target.value)}
                            disabled={submitting}
                        />

                        <div className="mock-actions">
                            <button 
                                type="button" 
                                className={`listening-btn ${isListening ? 'listening-btn--active' : ''}`}
                                onClick={toggleListening}
                                disabled={submitting}
                                title={isListening ? "Stop listening" : "Start voice dictation"}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v1a7 7 0 0 1-14 0v-1"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
                                {isListening ? "Listening..." : "Dictate Answer"}
                            </button>

                            <button 
                                className="button primary-button submit-ans-btn"
                                onClick={handleSubmitAnswer}
                                disabled={submitting || !answerText.trim()}
                            >
                                {submitting ? (
                                    <>
                                        <span className="spinner"></span>
                                        Evaluating...
                                    </>
                                ) : "Submit Answer"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const CodingSandbox = ({ interviewId, useInterviewHook }) => {
    const { 
        loading, 
        codingSession, 
        fetchChallenges, 
        submitCode 
    } = useInterviewHook;

    const [selectedChallengeIdx, setSelectedChallengeIdx] = useState(0);
    const [userCode, setUserCode] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchChallenges(interviewId);
    }, [interviewId]);

    useEffect(() => {
        if (codingSession && codingSession.challenges) {
            const ch = codingSession.challenges[selectedChallengeIdx];
            if (ch) {
                setUserCode(ch.userCode || ch.starterCode || "");
            }
        }
    }, [codingSession, selectedChallengeIdx]);

    const handleSelectChallenge = (idx) => {
        setSelectedChallengeIdx(idx);
    };

    const handleResetCode = () => {
        if (codingSession && codingSession.challenges) {
            const ch = codingSession.challenges[selectedChallengeIdx];
            if (ch && window.confirm("Reset editor to default template? Your changes will be lost.")) {
                setUserCode(ch.starterCode || "");
            }
        }
    };

    const handleLanguageChange = (e) => {
        const newLang = e.target.value;
        fetchChallenges(interviewId, newLang);
    };

    const handleSubmitCode = async () => {
        if (!userCode.trim()) {
            alert("Editor is empty. Write your solution before submitting.");
            return;
        }
        setSubmitting(true);
        try {
            const ch = codingSession.challenges[selectedChallengeIdx];
            await submitCode(interviewId, ch._id, userCode.trim());
        } catch (err) {
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading && !codingSession) {
        return (
            <div className="sandbox-container">
                <div className="sandbox-loading">Loading coding challenges...</div>
            </div>
        );
    }

    if (!codingSession || !codingSession.challenges || codingSession.challenges.length === 0) {
        return (
            <div className="sandbox-container">
                <div className="sandbox-loading">Loading sandbox...</div>
            </div>
        );
    }

    const currentChallenge = codingSession.challenges[selectedChallengeIdx];
    const evaluation = currentChallenge.evaluation;

    return (
        <div className="sandbox-workspace">
            <div className="sandbox-split-layout">
                {/* Left side: Instructions and live camera */}
                <div className="sandbox-instructions-panel">
                    <LiveCamera userName={useInterviewHook.report?.user?.username || "Candidate"} />
                    
                    <div className="challenges-tabs">
                        {codingSession.challenges.map((c, i) => (
                            <button 
                                key={i}
                                className={`challenge-tab-btn ${selectedChallengeIdx === i ? 'challenge-tab-btn--active' : ''}`}
                                onClick={() => handleSelectChallenge(i)}
                            >
                                Challenge {i + 1}
                            </button>
                        ))}
                    </div>

                    <div className="challenge-detail">
                        <div className="challenge-detail-header">
                            <h3>{currentChallenge.title}</h3>
                            <span className={`difficulty-badge difficulty-badge--${currentChallenge.difficulty.toLowerCase()}`}>
                                {currentChallenge.difficulty}
                            </span>
                        </div>

                        <p className="challenge-desc">{currentChallenge.description}</p>

                        {currentChallenge.constraints && (
                            <div className="challenge-section">
                                <h4>Constraints:</h4>
                                <p className="monospace-block">{currentChallenge.constraints}</p>
                            </div>
                        )}

                        {currentChallenge.examples && currentChallenge.examples.length > 0 && (
                            <div className="challenge-section">
                                <h4>Examples:</h4>
                                {currentChallenge.examples.map((ex, i) => (
                                    <div key={i} className="example-item">
                                        <p><strong>Example {i + 1}:</strong></p>
                                        <p className="monospace-block">
                                            Input: {ex.input}<br />
                                            Output: {ex.output}
                                        </p>
                                        {ex.explanation && (
                                            <p className="example-expl">Explanation: {ex.explanation}</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right side: Editor Panel and Evaluations Console */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
                    <div className="sandbox-editor-panel">
                        <div className="editor-header">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <span className="lang-label">Language:</span>
                                <select 
                                    className="sandbox-lang-select"
                                    value={codingSession.language || "JavaScript"}
                                    onChange={handleLanguageChange}
                                    disabled={submitting}
                                >
                                    <option value="JavaScript">JavaScript</option>
                                    <option value="Python">Python</option>
                                    <option value="Java">Java</option>
                                    <option value="C++">C++</option>
                                    <option value="Go">Go</option>
                                </select>
                            </div>
                            <button className="reset-code-btn" onClick={handleResetCode} disabled={submitting}>
                                Reset Starter Code
                            </button>
                        </div>

                        <div className="editor-container">
                            <textarea 
                                className="code-textarea"
                                value={userCode}
                                onChange={(e) => setUserCode(e.target.value)}
                                disabled={submitting}
                            />
                        </div>

                        <div className="editor-actions">
                            <button 
                                className="button primary-button run-eval-btn"
                                onClick={handleSubmitCode}
                                disabled={submitting}
                            >
                                {submitting ? (
                                    <>
                                        <span className="spinner"></span>
                                        Analyzing solution...
                                    </>
                                ) : "Submit Solution for Review"}
                            </button>
                        </div>
                    </div>

                    <div className="sandbox-console">
                        <div className="console-header">
                            <span>Evaluation Review Console</span>
                            {evaluation && (
                                <span className="eval-score">Score: {evaluation.score}/100</span>
                            )}
                        </div>
                        <div className="console-body">
                            {evaluation ? (
                                <div className="evaluation-report">
                                    <div className="eval-complexities">
                                        <div className="complexity-tag blue-tag">
                                            Time: {evaluation.timeComplexity}
                                        </div>
                                        <div className="complexity-tag purple-tag">
                                            Space: {evaluation.spaceComplexity}
                                        </div>
                                    </div>
                                    
                                    <div className="eval-section">
                                        <h4>Analysis:</h4>
                                        <p>{evaluation.analysis}</p>
                                    </div>

                                    <div className="eval-section">
                                        <h4>Refactoring & Suggestions:</h4>
                                        <p>{evaluation.suggestions}</p>
                                    </div>

                                    <div className="eval-section model-sol">
                                        <h4>Optimal Solution:</h4>
                                        <pre><code>{evaluation.modelSolution}</code></pre>
                                    </div>
                                </div>
                            ) : (
                                <div className="console-empty">
                                    Write your code in the editor above and submit to see real-time logic analysis, time/space complexity, and code suggestions.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ── Main Component ────────────────────────────────────────────────────────────
const Interview = () => {
    const [ activeNav, setActiveNav ] = useState('technical')
    const useInterviewHook = useInterview()
    const { report, getReportById, loading, getResumePdf } = useInterviewHook
    const { user, handleLogout } = useAuth()
    const [ showProfileMenu, setShowProfileMenu ] = useState(false)
    const [ theme, setTheme ] = useState(() => localStorage.getItem("theme") || "dark")
    const { interviewId } = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme)
        localStorage.setItem("theme", theme)
    }, [ theme ])

    const toggleTheme = () => {
        setTheme(t => t === "dark" ? "light" : "dark")
    }

    useEffect(() => {
        if (interviewId) {
            getReportById(interviewId)
        }
    }, [ interviewId ])

    if (loading || !report) {
        return (
            <main className='premium-loading'>
                <div className='loading-card'>
                    <div className='radar-loader'>
                        <div className='radar-loader__circle radar-loader__circle--1' />
                        <div className='radar-loader__circle radar-loader__circle--2' />
                        <div className='radar-loader__circle radar-loader__circle--3' />
                        <span className='radar-loader__icon'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 2v2" />
                                <path d="M12 20v2" />
                                <path d="M4.93 4.93l1.41 1.41" />
                                <path d="M17.66 17.66l1.41 1.41" />
                                <path d="M2 12h2" />
                                <path d="M20 12h2" />
                                <path d="M6.34 17.66l-1.41 1.41" />
                                <path d="M19.07 4.93l-1.41 1.41" />
                            </svg>
                        </span>
                    </div>
                </div>
            </main>
        )
    }

    const scoreColor =
        report.matchScore >= 80 ? 'score--high' :
            report.matchScore >= 60 ? 'score--mid' : 'score--low'

    const technicalQuestions = report.technicalQuestions || []
    const behavioralQuestions = report.behavioralQuestions || []
    const skillGaps = report.skillGaps || []
    const preparationPlan = report.preparationPlan || []

    return (
        <div className='interview-page'>
            {/* Top Navigation Bar */}
            <div className="home-top-bar">
                <div className="back-to-home-container">
                    <button className='back-home-btn' onClick={() => navigate('/')}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="19" y1="12" x2="5" y2="12" />
                            <polyline points="12 19 5 12 12 5" />
                        </svg>
                        Back to Dashboard
                    </button>
                </div>
                
                <div className="top-bar-actions">
                    <button className="theme-toggle-btn" onClick={toggleTheme} title="Toggle Theme">
                        {theme === 'dark' ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
                        )}
                    </button>

                    {user && (
                        <div className="profile-menu-container">
                            <button className="avatar-btn" onClick={() => setShowProfileMenu(!showProfileMenu)}>
                                {user.username ? user.username[0].toUpperCase() : 'U'}
                            </button>
                            {showProfileMenu && (
                                <div className="profile-dropdown">
                                    <div className="user-details">
                                        <p className="user-name">{user.username}</p>
                                        <p className="user-email">{user.email}</p>
                                    </div>
                                    <div className="dropdown-divider" />
                                    <button className="logout-btn" onClick={handleLogout}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></svg>
                                        Sign Out
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
            
            <div className='interview-layout'>

                {/* ── Left Nav ── */}
                <nav className='interview-nav'>
                    <div className="nav-content">
                        <p className='interview-nav__label'>Sections</p>
                        {NAV_ITEMS.map(item => (
                            <button
                                key={item.id}
                                className={`interview-nav__item ${activeNav === item.id ? 'interview-nav__item--active' : ''}`}
                                onClick={() => setActiveNav(item.id)}
                            >
                                <span className='interview-nav__icon'>{item.icon}</span>
                                {item.label}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={() => { getResumePdf(interviewId) }}
                        className='button primary-button download-pdf-btn' >
                        <svg height={"0.8rem"} style={{ marginRight: "0.8rem" }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M10.6144 17.7956 11.492 15.7854C12.2731 13.9966 13.6789 12.5726 15.4325 11.7942L17.8482 10.7219C18.6162 10.381 18.6162 9.26368 17.8482 8.92277L15.5079 7.88394C13.7092 7.08552 12.2782 5.60881 11.5105 3.75894L10.6215 1.61673C10.2916.821765 9.19319.821767 8.8633 1.61673L7.97427 3.75892C7.20657 5.60881 5.77553 7.08552 3.97685 7.88394L1.63658 8.92277C.868537 9.26368.868536 10.381 1.63658 10.7219L4.0523 11.7942C5.80589 12.5726 7.21171 13.9966 7.99275 15.7854L8.8704 17.7956C9.20776 18.5682 10.277 18.5682 10.6144 17.7956ZM19.4014 22.6899 19.6482 22.1242C20.0882 21.1156 20.8807 20.3125 21.8695 19.8732L22.6299 19.5353C23.0412 19.3526 23.0412 18.7549 22.6299 18.5722L21.9121 18.2532C20.8978 17.8026 20.0911 16.9698 19.6586 15.9269L19.4052 15.3156C19.2285 14.8896 18.6395 14.8896 18.4628 15.3156L18.2094 15.9269C17.777 16.9698 16.9703 17.8026 15.956 18.2532L15.2381 18.5722C14.8269 18.7549 14.8269 19.3526 15.2381 19.5353L15.9985 19.8732C16.9874 20.3125 17.7798 21.1156 18.2198 22.1242L18.4667 22.6899C18.6473 23.104 19.2207 23.104 19.4014 22.6899Z"></path></svg>
                        Download Resume
                    </button>
                </nav>

                <div className='interview-divider' />

                {/* ── Center Content ── */}
                <main className='interview-content'>
                    {activeNav === 'technical' && (
                        <section>
                            <div className='content-header'>
                                <h2>Technical Questions</h2>
                                <span className='content-header__count'>{technicalQuestions.length} questions</span>
                            </div>
                            <div className='q-list'>
                                {technicalQuestions.map((q, i) => (
                                    <QuestionCard key={i} item={q} index={i} />
                                ))}
                            </div>
                        </section>
                    )}

                    {activeNav === 'behavioral' && (
                        <section>
                            <div className='content-header'>
                                <h2>Behavioral Questions</h2>
                                <span className='content-header__count'>{behavioralQuestions.length} questions</span>
                            </div>
                            <div className='q-list'>
                                {behavioralQuestions.map((q, i) => (
                                    <QuestionCard key={i} item={q} index={i} />
                                ))}
                            </div>
                        </section>
                    )}

                    {activeNav === 'roadmap' && (
                        <section>
                            <div className='content-header'>
                                <h2>Preparation Road Map</h2>
                                <span className='content-header__count'>{preparationPlan.length}-day plan</span>
                            </div>
                            <div className='roadmap-list'>
                                {preparationPlan.map((day) => (
                                    <RoadMapDay key={day.day} day={day} />
                                ))}
                            </div>
                        </section>
                    )}

                    {activeNav === 'mock' && (
                        <section>
                            <div className='content-header'>
                                <h2>Mock Interview Room</h2>
                                <span className='content-header__count'>Interactive AI Room</span>
                            </div>
                            <MockInterview interviewId={interviewId} useInterviewHook={useInterviewHook} />
                        </section>
                    )}

                    {activeNav === 'sandbox' && (
                        <section>
                            <div className='content-header'>
                                <h2>Coding Sandbox</h2>
                                <span className='content-header__count'>AI Code Reviewer</span>
                            </div>
                            <CodingSandbox interviewId={interviewId} useInterviewHook={useInterviewHook} />
                        </section>
                    )}
                </main>

                <div className='interview-divider' />

                {/* ── Right Sidebar ── */}
                <aside className='interview-sidebar'>

                    {/* Match Score */}
                    <div className='match-score'>
                        <p className='match-score__label'>Match Score</p>
                        <div className='match-score__ring-container'>
                            <svg className="match-score__svg" width="100" height="100" viewBox="0 0 100 100">
                                <circle 
                                    className="match-score__svg-bg" 
                                    cx="50" 
                                    cy="50" 
                                    r="40" 
                                    strokeWidth="6" 
                                    fill="transparent" 
                                />
                                <circle 
                                    className={`match-score__svg-bar ${scoreColor}`} 
                                    cx="50" 
                                    cy="50" 
                                    r="40" 
                                    strokeWidth="8" 
                                    fill="transparent" 
                                    strokeDasharray="251.2"
                                    strokeDashoffset={251.2 - (report.matchScore / 100) * 251.2}
                                    strokeLinecap="round"
                                />
                            </svg>
                            <div className='match-score__text-overlay'>
                                <span className='match-score__value'>{report.matchScore}</span>
                                <span className='match-score__pct'>%</span>
                            </div>
                        </div>
                        <p className={`match-score__sub ${scoreColor}`}>{
                            report.matchScore >= 80 ? 'Strong candidate profile' :
                            report.matchScore >= 60 ? 'Potential profile match' : 'Requires key upskilling'
                        }</p>
                    </div>

                    <div className='sidebar-divider' />

                    {/* Skill Gaps */}
                    <div className='skill-gaps'>
                        <p className='skill-gaps__label'>Skill Gaps</p>
                        <div className='skill-gaps__list'>
                            {skillGaps.map((gap, i) => (
                                <span key={i} className={`skill-tag skill-tag--${gap.severity}`}>
                                    {gap.skill}
                                </span>
                            ))}
                            {skillGaps.length === 0 && (
                                <span className="skill-tag skill-tag--none">No significant gaps found</span>
                            )}
                        </div>
                    </div>

                </aside>
            </div>
        </div>
    )
}

export default Interview