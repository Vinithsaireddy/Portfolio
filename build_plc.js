const {
    Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
    AlignmentType, HeadingLevel, BorderStyle, WidthType, ShadingType,
    PageBreak, LevelFormat
} = require('docx');
const fs = require('fs');

const DARK_BLUE = "1F3A7A", MEDIUM_BLUE = "2E4099", RED = "C00000", GREEN = "006400";
const INFO_BG = "E8F4FD", WARN_BG = "FFE6E6", KEY_BG = "FFF3CD", SUCCESS_BG = "E6FFE6";
const VERY_IMP_BG = "FFE6E6", IMP_BG = "FFF0E6", MOD_BG = "F0FFF0";
const HEADER_BG = "1F3A7A";

function bdr(color = "CCCCCC") { const s = { style: BorderStyle.SINGLE, size: 1, color }; return { top: s, bottom: s, left: s, right: s }; }
function noBdr() { const s = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" }; return { top: s, bottom: s, left: s, right: s }; }
function h1(t) { return new Paragraph({ heading: HeadingLevel.HEADING_1, spacing: { before: 360, after: 180 }, children: [new TextRun({ text: t, bold: true, color: DARK_BLUE, font: "Arial", size: 32 })] }); }
function h2(t) { return new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { before: 240, after: 120 }, children: [new TextRun({ text: t, bold: true, color: MEDIUM_BLUE, font: "Arial", size: 26 })] }); }
function h3(t) { return new Paragraph({ heading: HeadingLevel.HEADING_3, spacing: { before: 200, after: 100 }, children: [new TextRun({ text: t, bold: true, color: RED, font: "Arial", size: 24 })] }); }
function h4(t) { return new Paragraph({ spacing: { before: 160, after: 80 }, children: [new TextRun({ text: t, bold: true, color: GREEN, font: "Arial", size: 22 })] }); }
function para(t) { return new Paragraph({ spacing: { before: 80, after: 80 }, children: [new TextRun({ text: t, font: "Arial", size: 20 })] }); }
function blt(t) { return new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { before: 40, after: 40 }, children: [new TextRun({ text: t, font: "Arial", size: 20 })] }); }
function cod(t) { return new Paragraph({ spacing: { before: 20, after: 20 }, children: [new TextRun({ text: t, font: "Courier New", size: 18 })] }); }
function empty() { return new Paragraph({ children: [new TextRun("")] }); }
function pgBreak() { return new Paragraph({ children: [new PageBreak()] }); }

function colorBox(t, bg, textColor = "000000", bold = false) {
    return new Table({
        width: { size: 9360, type: WidthType.DXA }, columnWidths: [9360],
        rows: [new TableRow({
            children: [new TableCell({
                borders: noBdr(), shading: { fill: bg, type: ShadingType.CLEAR },
                margins: { top: 100, bottom: 100, left: 150, right: 150 }, width: { size: 9360, type: WidthType.DXA },
                children: [new Paragraph({ children: [new TextRun({ text: t, font: "Arial", size: 20, bold, color: textColor })] })]
            })]
        })]
    });
}

function mkTable(headers, rows, colWidths) {
    const cwArr = colWidths;
    const total = cwArr.reduce((a, b) => a + b, 0);
    const hrow = new TableRow({ children: headers.map((h, i) => new TableCell({ borders: bdr("999999"), shading: { fill: HEADER_BG, type: ShadingType.CLEAR }, width: { size: cwArr[i], type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: h, bold: true, color: "FFFFFF", font: "Arial", size: 20 })] })] })) });
    const drows = rows.map(row => new TableRow({ children: row.map((cell, i) => new TableCell({ borders: bdr("CCCCCC"), width: { size: cwArr[i], type: WidthType.DXA }, margins: { top: 60, bottom: 60, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: cell, font: "Arial", size: 20 })] })] })) }));
    return new Table({ width: { size: total, type: WidthType.DXA }, columnWidths: cwArr, rows: [hrow, ...drows] });
}

function qHdr(qNum, question, module, marks, priority, sources, times) {
    const priBg = priority === "VERY IMPORTANT" ? VERY_IMP_BG : priority === "IMPORTANT" ? IMP_BG : MOD_BG;
    return new Table({
        width: { size: 9360, type: WidthType.DXA }, columnWidths: [9360], rows: [new TableRow({
            children: [new TableCell({
                borders: bdr("1F3A7A"), shading: { fill: HEADER_BG, type: ShadingType.CLEAR }, width: { size: 9360, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 150, right: 150 }, children: [
                    new Paragraph({ children: [new TextRun({ text: `${qNum}: ${question}`, bold: true, color: "FFFFFF", font: "Arial", size: 22 })] }),
                    new Paragraph({ children: [new TextRun({ text: `Module: ${module}  |  Marks: ${marks}  |  Priority: ${priority}`, color: "FFFF99", font: "Arial", size: 18 })] }),
                    new Paragraph({ children: [new TextRun({ text: `Appeared in: ${sources}  |  Times: ${times}`, color: "CCFFCC", font: "Arial", size: 18 })] })
                ]
            })]
        })]
    });
}

function simpleBox(t) { return colorBox("SIMPLE EXPLANATION: " + t, INFO_BG, "003366"); }
function keyBox(t) { return colorBox("EXAM KEYWORDS: " + t, KEY_BG, "5B3000"); }
function drawNote() { return colorBox("Draw this diagram in the exam for extra marks!", WARN_BG, RED, true); }

const ch = [];

// ============ COVER PAGE ============
ch.push(new Paragraph({ spacing: { before: 2880 }, children: [new TextRun("")] }));
ch.push(new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "INTRODUCTION TO PLC", bold: true, font: "Arial", size: 56, color: DARK_BLUE })] }));
ch.push(new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "BRI515A | 5th Semester B.E./B.Tech. (VTU)", font: "Arial", size: 28, color: "555555" })] }));
ch.push(empty());
ch.push(new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "COMPLETE EXAM PREPARATION HANDBOOK — ALL 44 QUESTIONS ANSWERED", bold: true, font: "Arial", size: 28, color: RED })] }));
ch.push(empty());
ch.push(colorBox("Department of Robotics & Artificial Intelligence Engineering\nBangalore Institute of Technology (Affiliated to VTU, Belagavi)\nAccredited by NAAC with A+ Grade", HEADER_BG, "FFFFFF", true));
ch.push(empty());
ch.push(colorBox("Covers: QP1 (Dec 2024/Jan 2025) | QP2 (Dec 2025/Jan 2026) | IAT (Sept 2025)\nAll 44 Questions with Complete Answers | 5 Modules | Revision Sheets | Mind Maps", INFO_BG, DARK_BLUE));
ch.push(empty());
ch.push(new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Prof. Sunitha M K | DEPT OF RAI, BIT | 2025-26", font: "Arial", size: 22, color: "555555" })] }));
ch.push(pgBreak());

// ============ MODULE 1 ============
ch.push(h1("MODULE 1: Introduction to PLC Systems & Hardware"));
ch.push(h2("1.1 Theory Notes"));
ch.push(h3("What is a PLC?"));
ch.push(para("A PLC (Programmable Logic Controller) is an industrial-grade digital computer designed specifically for control functions in manufacturing and industrial processes. It is capable of being programmed to perform complex control operations, replacing conventional relay logic circuits. PLCs are designed for harsh industrial environments with immunity to electrical noise, temperature extremes, vibration, and impact. Programs are stored in battery-backed or non-volatile memory, ensuring data retention even during power failures."));
ch.push(empty());
ch.push(h4("PLC Architecture — Block Diagram"));
ch.push(drawNote());
ch.push(cod("+----------------------------+"));
ch.push(cod("|   PROGRAMMING DEVICE       |"));
ch.push(cod("|  (PC/Handheld/HMI)         |"));
ch.push(cod("+-------------+--------------+"));
ch.push(cod("              |               "));
ch.push(cod("+-------------v--------------+   +------------------+"));
ch.push(cod("|   CENTRAL PROCESSING UNIT  |   |   POWER SUPPLY   |"));
ch.push(cod("|   - Control Unit (CPU)     |<--| 115/230VAC→5VDC  |"));
ch.push(cod("|   - ALU / Processor        |   +------------------+"));
ch.push(cod("|   - Program Memory (ROM)   |"));
ch.push(cod("|   - Data Memory (RAM)      |"));
ch.push(cod("+-------+----------+---------+"));
ch.push(cod("        |          |           "));
ch.push(cod("+-------v----+ +---v--------+"));
ch.push(cod("| INPUT      | | OUTPUT     |"));
ch.push(cod("| MODULE     | | MODULE     |"));
ch.push(cod("| Optical    | | Optical    |"));
ch.push(cod("| Isolation  | | Isolation  |"));
ch.push(cod("+-------+----+ +---+--------+"));
ch.push(cod("        |          |           "));
ch.push(cod("+-------v----+ +---v--------+"));
ch.push(cod("| INPUT      | | OUTPUT     |"));
ch.push(cod("| DEVICES    | | DEVICES    |"));
ch.push(cod("| Sensors,   | | Motors,    |"));
ch.push(cod("| Switches   | | Valves,    |"));
ch.push(cod("| Pushbttns  | | Lights     |"));
ch.push(cod("+------------+ +------------+"));
ch.push(empty());
ch.push(h4("PLC Scan Cycle (Principle of Operation):"));
ch.push(cod("Step 1: INPUT SCAN   → Read all inputs → Store in Input Image Table"));
ch.push(cod("Step 2: PROGRAM EXEC → Execute ladder logic → Make decisions"));
ch.push(cod("Step 3: OUTPUT SCAN  → Update Output Image Table → Drive outputs"));
ch.push(cod("Step 4: HOUSEKEEPING → Self-diagnostics → Communication updates"));
ch.push(cod("[Repeat continuously — this makes PLC a real-time system]"));
ch.push(empty());
ch.push(h4("Memory Types in PLC:"));
ch.push(mkTable(["Memory Type", "Volatile?", "Use"], [["RAM (CMOS)", "Yes (needs battery)", "User program + runtime data"], ["ROM", "No", "Operating system (factory programmed)"], ["EPROM", "No", "Program backup (UV light erase)"], ["EEPROM", "No", "Permanent program storage, no battery needed"], ["Flash EEPROM", "No", "Fast backup, auto-saves RAM on power fail"]], [2500, 1500, 5360]));
ch.push(empty());
ch.push(h4("Addressing Methods:"));
ch.push(cod("Rack/Slot-Based (Allen-Bradley SLC 500):"));
ch.push(cod("  I:1/1  = Input, rack slot 1, terminal 1"));
ch.push(cod("  O:2/3  = Output, rack slot 2, bit 3"));
ch.push(cod("Tag-Based (Allen-Bradley ControlLogix):"));
ch.push(cod("  Pressure_switch   (instead of I:1/1)"));
ch.push(cod("  Temperature_switch (instead of I:1/2)"));
ch.push(cod("  Mixer_motor        (instead of O:2/1)"));
ch.push(empty());

ch.push(h2("1.2 All Questions — Module 1"));
[["M1-Q1", "What is PLC? Mention its advantages and disadvantages.", "1", "10", "VERY IMPORTANT", "QP2", "1"],
["M1-Q2", "Sketch/Explain the internal architecture of PLC and discuss all its important components.", "1", "10", "VERY IMPORTANT", "QP1, QP2, IAT", "3"],
["M1-Q3", "What are the advantages and disadvantages of PLCs?", "1", "10", "VERY IMPORTANT", "QP1", "1"],
["M1-Q4", "Explain the architecture of PLC.", "1", "10", "VERY IMPORTANT", "QP1", "1"],
["M1-Q5", "Differentiate between Relay logic control and PLC logic control.", "1", "10", "VERY IMPORTANT", "QP1, IAT", "2"],
["M1-Q6", "Explain the internal architecture of PLC.", "1", "10", "VERY IMPORTANT", "QP1", "1"],
["M1-Q7", "Define input and output modular in PLC and briefly classify its types.", "1", "10", "IMPORTANT", "QP2", "1"],
["M1-Q8", "What is RLC? Differentiate between RLC and PLC.", "1", "10", "IMPORTANT", "QP2", "1"],
["M1-Q9", "Differentiate between Relay-based control systems and PLCs.", "1", "10", "VERY IMPORTANT", "IAT", "1"],
["M1-Q10", "Discuss the various addressing methods employed in PLC programming and their significance.", "1", "10", "IMPORTANT", "IAT", "1"],
["M1-Q11", "With an example explain how the PLC architecture makes it suitable for real-time control.", "1", "10", "IMPORTANT", "IAT", "1"],
["M1-Q12", "Explain the role of input/output interfacing in enhancing the functionality of PLC-based automation systems.", "1", "10", "IMPORTANT", "IAT", "1"],
].forEach(q => ch.push(qHdr(q[0], q[1], q[2], q[3], q[4], q[5], q[6])));
ch.push(empty());

ch.push(h2("1.3 Complete Answers — Module 1"));

ch.push(qHdr("M1-Q1/Q3", "What is PLC? Mention its advantages and disadvantages.", "1", "10", "VERY IMPORTANT", "QP1, QP2", "2+"));
ch.push(simpleBox("A PLC is an industrial-grade programmable digital computer that controls machines by executing a user-written program, replacing traditional relay wiring panels."));
ch.push(h4("Definition:"));
ch.push(para("A PLC (Programmable Logic Controller) is an industrial-grade digital computer designed for control functions in manufacturing and industrial processes that is capable of being programmed to perform control functions. PLCs are designed for extended temperature ranges, provide immunity to electrical noise, are resistant to vibration and impact, and ensure reliable operation in harsh industrial environments. Programs are stored in battery-backed or non-volatile memory."));
ch.push(h4("Advantages:"));
ch.push(blt("Increased Reliability: Solid-state components, no mechanical wear; battery-backed memory retains program during power failure"));
ch.push(blt("More Flexibility: Program changes via software; no rewiring required; OEM can send system updates as new programs"));
ch.push(blt("Lower Cost: Originally designed to replace relay control logic; cost savings over relay panels have been significant"));
ch.push(blt("Communications Capability: Can communicate with other PLCs/computers for SCADA, data gathering, monitoring"));
ch.push(blt("Faster Response Time: Designed for high-speed and real-time applications; thousands of events processed per second"));
ch.push(blt("Easier to Troubleshoot: Built-in diagnostics and override functions; program visible on monitor in real time"));
ch.push(blt("Easier to Test Field Devices: All devices wired back to common point on PLC module; quick checking at one location"));
ch.push(h4("Disadvantages:"));
ch.push(blt("Complexity: Requires specialized programming language and extensive training"));
ch.push(blt("Limited processing power compared to DCS for highly complex tasks"));
ch.push(blt("Limited expandability for tasks outside the original design scope"));
ch.push(blt("Cost: Initial purchase and maintenance can still be expensive"));
ch.push(blt("Dependence on programming: Incorrect program causes malfunction and downtime"));
ch.push(keyBox("Industrial-grade, Programmable, Real-time, Non-volatile memory, Solid-state, Relay replacement, SCADA, Ladder logic, Battery-backed, Scan cycle"));
ch.push(empty());

ch.push(qHdr("M1-Q2/Q4/Q6", "Sketch/Explain the internal architecture of PLC and discuss all its important components.", "1", "10", "VERY IMPORTANT", "QP1, QP2, IAT", "3"));
ch.push(simpleBox("PLC architecture = computer system for factories. CPU is the brain; memory stores the program; input module reads sensors; output module drives motors; power supply feeds all; programming device writes the code."));
ch.push(h4("PLC Architecture — 6 Main Components:"));
ch.push(drawNote());
ch.push(cod("+----------------------------+    +--------------------+"));
ch.push(cod("|   PROGRAMMING DEVICE       |    |   POWER SUPPLY     |"));
ch.push(cod("| (PC/Handheld, runs RSLogix)|    | 115/230VAC → 5VDC  |"));
ch.push(cod("+-----------+----------------+    +---------+----------+"));
ch.push(cod("            |                               |"));
ch.push(cod("+-----------|-------------------------------v------+"));
ch.push(cod("|           v     CPU (Central Processing Unit)   |"));
ch.push(cod("|  +----------------+   +-----------------------+ |"));
ch.push(cod("|  | Control Unit   |   | Memory Section        | |"));
ch.push(cod("|  | (Program exec, |   | ROM: OS (non-volatile)| |"));
ch.push(cod("|  |  Scan cycle)   |   | RAM: Program+Data     | |"));
ch.push(cod("|  +----------------+   | EEPROM: Backup        | |"));
ch.push(cod("|                       +-----------------------+ |"));
ch.push(cod("+------+------------------------------------+------+"));
ch.push(cod("       |                                    |"));
ch.push(cod("+------v-----------+        +---------------v------+"));
ch.push(cod("|  INPUT MODULE    |        |   OUTPUT MODULE      |"));
ch.push(cod("| Optical Isolator |        |  Optical Isolator    |"));
ch.push(cod("| 120VAC → 5VDC   |        |  5VDC → 24VDC/120VAC|"));
ch.push(cod("| Status LEDs      |        |  Status LEDs         |"));
ch.push(cod("+------+-----------+        +----------+-----------+"));
ch.push(cod("       |                               |"));
ch.push(cod("+------v-----------+        +----------v-----------+"));
ch.push(cod("|  INPUT DEVICES   |        |   OUTPUT DEVICES     |"));
ch.push(cod("| Sensors,Switches |        | Motors,Solenoids,    |"));
ch.push(cod("| Pushbuttons,     |        | Indicator Lights,    |"));
ch.push(cod("| Limit switches   |        | Valves, Alarms       |"));
ch.push(cod("+------------------+        +----------------------+"));
ch.push(empty());
ch.push(h4("1. CPU (Central Processing Unit):"));
ch.push(para("Brain of the PLC. Consists of control unit + processor. Executes ladder logic program in continuous scan cycle. Manages communication between all modules. Three modes: RUN (executes program), PROG (editing, outputs de-energized), REM (remote mode). The CPU reads inputs, executes the program, and updates outputs repeatedly every few milliseconds."));
ch.push(h4("2. Memory Section:"));
ch.push(para("RAM (volatile, battery-backed) stores user program and runtime data. ROM stores operating system firmware (factory programmed, non-volatile). EEPROM provides non-volatile storage without battery. Flash Memory provides fast backup auto-saving RAM on power failure. Memory is organized in words (16 bits each): Input Image Table, Output Image Table, Timer/Counter files, Data files."));
ch.push(h4("3. Input Module:"));
ch.push(para("Interface between field input devices (sensors, switches, pushbuttons) and CPU. Converts high field voltage (120VAC) to logic-level voltage (5VDC) for CPU. Contains optical isolator to protect CPU from high voltages using light. Status LEDs indicate current ON/OFF state of each input."));
ch.push(h4("4. Output Module:"));
ch.push(para("Converts CPU logic signals to field-level control signals. Drives motors, solenoid valves, indicator lights, alarms, and relays. Also uses optical isolation for protection. Can handle AC/DC loads at various voltages. Has fuse protection on each output."));
ch.push(h4("5. Power Supply:"));
ch.push(para("Converts 115VAC or 230VAC input to 5VDC required by CPU, memory, and I/O circuitry. Feeds backplane which distributes power to all modules. For large systems, does not power field devices — those have external power."));
ch.push(h4("6. Programming Device:"));
ch.push(para("PC or handheld device used to create, edit, and download ladder logic programs. Also used for monitoring, debugging, and diagnostics during operation. Communicates via serial, parallel, USB, or Ethernet. Can be unplugged after program is downloaded."));
ch.push(h4("Scan Cycle (Real-Time Operation):"));
ch.push(cod("INPUT SCAN → PROGRAM EXECUTION → OUTPUT SCAN → HOUSEKEEPING → repeat"));
ch.push(cod("Typical scan time: 5 to 20 milliseconds — enabling real-time control"));
ch.push(keyBox("CPU, Scan Cycle, Input Image Table, Output Image Table, Optical Isolation, Backplane, ROM, RAM, EEPROM, Power Supply, Programming Device, RUN/PROG/REM modes, Battery backup"));
ch.push(empty());

ch.push(qHdr("M1-Q5/Q9", "Differentiate between Relay Logic Control and PLC Logic Control.", "1", "10", "VERY IMPORTANT", "QP1, IAT", "2"));
ch.push(simpleBox("Relay logic uses physical hardware (relays + wiring) for control. PLC logic uses software programs. Relay = hard-wired, fixed; PLC = programmable, flexible. PLCs replaced relay panels because software is cheaper and easier to change than rewiring."));
ch.push(mkTable(["Aspect", "Relay Control", "PLC Logic Control"], [
    ["Control Method", "Hard-wired relays for logic operations", "Software/programming for logic operations"],
    ["Flexibility", "Difficult to modify — requires rewiring", "Easy to modify — changes done through programming"],
    ["Complexity", "Suitable only for simple ON/OFF control", "Handles simple to highly complex industrial processes"],
    ["Speed", "Slower due to mechanical switching", "Faster due to electronic operation"],
    ["Maintenance", "High — relay contacts wear out over time", "Low — solid-state, minimal wear and tear"],
    ["Troubleshooting", "Time-consuming — manual checking required", "Easy — built-in diagnostics and monitoring tools"],
    ["Space", "Bulky, requires large wiring panels", "Compact, reduces wiring and panel space"],
    ["Reliability", "Less reliable in harsh environments", "Highly reliable, resistant to noise/vibration/temp"],
    ["Functions", "Limited to switching (ON/OFF) and interlocking", "Timing, counting, comparison, analog processing"],
    ["Upgradability", "Cannot be upgraded easily", "Upgraded with new programs and modules"],
], [2000, 3680, 3680]));
ch.push(keyBox("Hard-wired, Relay contacts, Solid-state, Electronic switching, Diagnostics, Compact, Reliability, Programmable, Software logic, Flexibility"));
ch.push(empty());

ch.push(qHdr("M1-Q7", "Define input and output modular in PLC and briefly classify its types.", "1", "10", "IMPORTANT", "QP2", "1"));
ch.push(simpleBox("Input modules are the 'ears' — they receive signals from sensors and switches. Output modules are the 'hands' — they control motors, lights, and valves. Both are available in various types to match different field devices."));
ch.push(h4("Input Module — Definition and Types:"));
ch.push(para("An input module is the interface between real-world field devices (sensors, switches, pushbuttons) and the PLC CPU. It converts field-level signals (24VDC, 120VAC) into logic-level signals (5VDC) for the CPU. It also provides optical isolation to protect the CPU."));
ch.push(mkTable(["Type", "Description", "Examples"], [
    ["Discrete Input", "Handles ON/OFF digital signals", "Pushbuttons, limit switches, proximity sensors"],
    ["Analog Input", "Accepts continuous signals", "4-20mA temp transmitters, 0-10V pressure sensors"],
    ["AC Input", "Accepts AC field signals", "120VAC / 240VAC input devices"],
    ["DC Input", "Accepts DC field signals", "24VDC proximity sensors, encoders"],
    ["Thermocouple Input", "Specially designed for temp", "Thermocouples, RTD sensors"],
], [2500, 3500, 3360]));
ch.push(h4("Output Module — Definition and Types:"));
ch.push(para("An output module receives control signals from the CPU and converts them to signals capable of driving field-level output devices such as motors, solenoids, indicator lights, and valves."));
ch.push(mkTable(["Type", "Description", "Examples"], [
    ["Discrete Output", "Controls ON/OFF devices", "Contactors, solenoids, indicator lights"],
    ["Analog Output", "Provides continuous control signals", "4-20mA valve control, VSD control (0-10V)"],
    ["Relay Output", "Uses electromagnetic relays", "Switches both AC and DC loads; 2A typical"],
    ["Transistor Output", "Fast DC switching", "High-speed applications, stepper motor control"],
    ["Triac Output", "Controls AC loads directly", "AC solenoids, heaters, lamps"],
], [2500, 3500, 3360]));
ch.push(keyBox("Discrete, Analog, AC, DC, Relay output, Transistor output, Triac, Optical isolation, 4-20mA, Input Image Table, Output Image Table, Fixed I/O, Modular I/O"));
ch.push(empty());

ch.push(qHdr("M1-Q8", "What is RLC? Differentiate between RLC and PLC.", "1", "10", "IMPORTANT", "QP2", "1"));
ch.push(simpleBox("RLC = Relay Logic Controller — the old hardware method using physical relays wired together. PLC = modern electronic replacement. RLC = 'hardware programming'; PLC = 'software programming'. PLCs are faster, smarter, and easier to change than RLC."));
ch.push(h4("What is RLC (Relay Logic Controller)?"));
ch.push(para("A Relay Logic Controller (RLC), also called a relay-based control system or relay panel, is a traditional industrial control system that uses electromagnetic relays wired in a fixed pattern to implement control logic. Complex control is achieved by wiring many relays in series and parallel combinations to create AND, OR, NOT logic functions. Components: electromagnetic relays (coils and contacts), hardwired connections, control panel, pilot devices."));
ch.push(h4("RLC vs PLC Comparison Table:"));
ch.push(mkTable(["Aspect", "RLC (Relay Logic Controller)", "PLC"], [
    ["Logic Method", "Hard-wired relays — logic fixed in wiring", "Programmable software — logic stored in memory"],
    ["Components", "Electromechanical relays (moving parts)", "Solid-state electronic components"],
    ["Modification", "Requires physical rewiring of panel", "Requires only editing software program"],
    ["Size", "Very bulky — large panels with hundreds of relays", "Compact — small box replaces entire panel"],
    ["Maintenance", "High — relay contacts wear out mechanically", "Low — no moving parts in solid-state design"],
    ["Speed", "Slower — limited by mechanical relay speed", "Faster — microsecond-level electronic switching"],
    ["Diagnostics", "No built-in diagnostics", "Built-in diagnostics, LED indicators, fault codes"],
    ["Advanced Functions", "Cannot perform math, PID, analog", "Timers, counters, math, PID, analog processing"],
    ["Communication", "Cannot communicate with computers/SCADA", "Built-in ports for SCADA, networking"],
    ["Replication", "Must rewire identical panel", "Download same program to new PLC"],
    ["Power Consumption", "High", "Low"],
    ["Cost", "High for large systems", "Initially similar but lower long-term"],
], [2000, 3680, 3680]));
ch.push(keyBox("RLC, Relay Logic Controller, Electromagnetic relay, Hard-wired, Solid-state, Electromechanical, Control panel, Flexibility, Memory, Diagnostics"));
ch.push(empty());

ch.push(qHdr("M1-Q10", "Discuss the various addressing methods employed in PLC programming and their significance.", "1", "10", "IMPORTANT", "IAT", "1"));
ch.push(simpleBox("Addressing = the PLC's way of keeping track of each sensor, motor, and data value in its memory. Like a house address tells you where to find someone, a PLC address tells the CPU where to find each piece of data. Two main styles: rack/slot (older) and tag-based (modern)."));
ch.push(h4("Definition:"));
ch.push(para("The PLC memory system stores information about the status of all inputs and outputs. To keep track of all this information, it uses a system called addressing. An address is a label or number that indicates where a certain piece of information is located in the PLC memory."));
ch.push(h4("1. Rack/Slot-Based Addressing (Allen-Bradley SLC 500):"));
ch.push(cod("Format:  [Type]:[Slot]/[Bit]"));
ch.push(cod("I = Input, O = Output, N = Integer data, T = Timer, C = Counter"));
ch.push(cod("Examples:"));
ch.push(cod("  I:1/1  = Input module in slot 1, terminal/bit 1"));
ch.push(cod("  O:2/3  = Output module in slot 2, bit 3"));
ch.push(cod("  N7:0   = Integer file 7, element 0"));
ch.push(cod("  T4:0/DN= Timer 4:0 Done bit"));
ch.push(cod("  C5:0/DN= Counter 5:0 Done bit"));
ch.push(h4("2. Tag-Based Addressing (Allen-Bradley ControlLogix):"));
ch.push(para("Uses descriptive names (tags) instead of numerical addresses. Base tags define memory locations. Alias tags create alternate descriptive names."));
ch.push(cod("Format:  [DescriptiveName] or Local:[Slot]:I.Data.[Bit]"));
ch.push(cod("Examples:"));
ch.push(cod("  Pressure_switch     (alias for I:1/1)"));
ch.push(cod("  Temperature_switch  (alias for I:1/2)"));
ch.push(cod("  Manual_pushbutton   (alias for I:1/3)"));
ch.push(cod("  Mixer_motor         (alias for O:2/1)"));
ch.push(h4("Significance of Addressing:"));
ch.push(blt("CPU locates and retrieves data from specific memory locations during program execution"));
ch.push(blt("Enables cross-referencing — find all rungs using a specific input/output"));
ch.push(blt("Tag-based addressing makes programs more readable and self-documenting"));
ch.push(blt("Addressing determines how data is stored in Input/Output Image Tables"));
ch.push(blt("Enables network addressing for remote I/O racks over communication cables"));
ch.push(keyBox("Rack/slot addressing, Tag-based addressing, Input image table, Output image table, SLC 500, ControlLogix, Alias tag, Base tag, I:1/1, Local:1:I.Data.1, Addressing, Memory organization"));
ch.push(empty());

ch.push(qHdr("M1-Q11", "With an example explain how the PLC architecture makes it suitable for real-time control.", "1", "10", "IMPORTANT", "IAT", "1"));
ch.push(simpleBox("Real-time = PLC responds within milliseconds when a sensor changes. The scan cycle (5-20ms) is so fast that the machine 'sees' it as instant. This makes PLCs perfect for conveyors, robotic arms, and safety systems."));
ch.push(h4("Key Architectural Features for Real-Time Control:"));
ch.push(blt("Dedicated CPU: Runs ONLY the control program — no background OS processes to cause delays"));
ch.push(blt("Input Image Table: All inputs captured at start of each scan — CPU sees a consistent snapshot"));
ch.push(blt("Output Image Table: All outputs updated simultaneously at end of scan — no partial updates"));
ch.push(blt("Deterministic Scan Time: Scan time is predictable and consistent (5-20ms per scan)"));
ch.push(blt("Optical Isolation: Protects CPU from electrical noise — maintains reliable real-time response"));
ch.push(h4("Example: Conveyor Belt Real-Time Control:"));
ch.push(drawNote());
ch.push(cod("Physical Setup:"));
ch.push(cod("  Sensor_1 (LS1)  → detects object entering  → Input I:0/1"));
ch.push(cod("  Sensor_2 (LS2)  → detects object at end    → Input I:0/2"));
ch.push(cod("  Motor (M1)      → conveyor belt motor      → Output O:0/1"));
ch.push(cod("  Alarm (ALM)     → end-of-belt alert        → Output O:0/2"));
ch.push(cod(""));
ch.push(cod("PLC Scan (one scan ≈ 10ms):"));
ch.push(cod("  Scan 1: INPUT SCAN  → reads LS1=ON, LS2=OFF → stores in image table"));
ch.push(cod("  Scan 1: PROGRAM     → rung1: LS1 ON → motor output set ON"));
ch.push(cod("  Scan 1: OUTPUT SCAN → O:0/1 energized → motor starts"));
ch.push(cod(""));
ch.push(cod("  [Object moves along belt...]"));
ch.push(cod(""));
ch.push(cod("  Scan N: INPUT SCAN  → LS1=ON, LS2=ON → object at end"));
ch.push(cod("  Scan N: PROGRAM     → rung2: LS2 ON → motor OFF, alarm ON"));
ch.push(cod("  Scan N: OUTPUT SCAN → motor stops, alarm sounds"));
ch.push(cod("  [Response time = 10ms — from machine perspective: INSTANTANEOUS]"));
ch.push(para("The modular PLC architecture enables fast, reliable, and real-time control in industrial automation because the CPU continuously cycles through its scan, each cycle taking only milliseconds, making the response effectively instantaneous for any industrial process."));
ch.push(keyBox("Real-time, Scan cycle, Deterministic, Input Image Table, Output Image Table, Response time, Optical isolation, Conveyor belt, Industrial automation, Millisecond response"));
ch.push(empty());

ch.push(qHdr("M1-Q12", "Explain the role of input/output interfacing in enhancing the functionality of PLC-based automation systems.", "1", "10", "IMPORTANT", "IAT", "1"));
ch.push(simpleBox("I/O interfacing = the bridge between the real physical world (sensors and actuators) and the PLC's digital logic world. Without I/O interfacing, the PLC would be isolated — it needs these interfaces to sense what's happening and take action."));
ch.push(h4("What is I/O Interfacing?"));
ch.push(para("I/O interfacing refers to the hardware modules and circuits that connect the PLC CPU to real-world field devices — sensors, switches, actuators, motors, solenoids, and indicators. The interface converts signals between field-level voltages and the logic-level voltages understood by the CPU."));
ch.push(h4("Block Diagram of I/O Interfacing:"));
ch.push(drawNote());
ch.push(cod("  INPUT SIDE:                           OUTPUT SIDE:"));
ch.push(cod("  Pushbuttons --+                 +-- Motors"));
ch.push(cod("  Limit Switches-+-> INPUT  ->CPU-> OUTPUT -+-- Solenoids"));
ch.push(cod("  Sensors ------+   MODULE       MODULE  +-- Indicators"));
ch.push(cod("  Encoders -----+                       +-- Valves"));
ch.push(cod(""));
ch.push(cod("  [INPUT INTERFACE]                [OUTPUT INTERFACE]"));
ch.push(cod("  Optical Isolator                 Optical Isolator"));
ch.push(cod("  Signal Conditioning              Signal Amplification"));
ch.push(cod("  120VAC → 5VDC level shift        5VDC → 24VDC level shift"));
ch.push(cod("  Status LED                       Status LED"));
ch.push(h4("Scope of I/O in Control Process:"));
ch.push(para("I/O interfacing enables the PLC to interact with the physical process. Inputs inform the PLC about current state (temperatures, pressures, positions). Outputs allow the PLC to change the process state (open valves, start motors, activate alarms)."));
ch.push(h4("Types of I/O with Examples:"));
ch.push(mkTable(["Type", "Examples"], [["Discrete Input", "Pushbuttons, limit switches, proximity sensors, photoelectric sensors"], ["Discrete Output", "Indicator lights, motor contactors, solenoid valves, alarms"], ["Analog Input", "4-20mA temperature transmitters, 0-10V pressure sensors, flow meters"], ["Analog Output", "Variable speed drive control (0-10V), proportional valve (4-20mA)"], ["Special Input", "Encoder (high-speed pulse), thermocouple, RTD temperature sensors"], ["Special Output", "Servo drive position commands, stepper motor pulse outputs"]], [2000, 7360]));
ch.push(h4("Modes of Communication and Cables:"));
ch.push(blt("Local I/O: Modules in same rack as CPU — connected via backplane bus (very fast)"));
ch.push(blt("Remote I/O: Modules near the machine — connected via coaxial cable (up to 2 miles) or fiber optic (over 20 miles)"));
ch.push(blt("Fiber optic cable: Immune to electrical noise — ideal for high-interference environments"));
ch.push(h4("Benefits of I/O Interfacing:"));
ch.push(blt("Optical isolator protects CPU from field-level voltages and electrical noise"));
ch.push(blt("Enables PLC to handle wide range of field device voltages (5VDC to 240VAC)"));
ch.push(blt("Modular I/O allows easy expansion as automation system grows"));
ch.push(blt("Remote I/O capability reduces wiring costs in large installations"));
ch.push(blt("Status LEDs on each I/O point simplify troubleshooting"));
ch.push(keyBox("Optical isolation, Signal conditioning, Discrete I/O, Analog I/O, Remote I/O, Fiber optic, Coaxial cable, Backplane, Local rack, 4-20mA, 0-10V, Level shifting"));
ch.push(empty());

ch.push(h2("1.4 Quick Revision — Module 1"));
ch.push(colorBox("PLC = Industrial digital computer | 7 Advantages: Reliable, Flexible, Low cost, Communications, Fast, Easy debug, Easy test\nArchitecture: CPU + Memory + Input Module + Output Module + Power Supply + Programming Device\nScan: Input Scan → Program Execution → Output Scan → Housekeeping\nMemory: RAM (volatile,battery) | ROM (OS,fixed) | EEPROM (non-volatile) | Flash (fast backup)\nAddressing: Rack/Slot (I:1/1) vs Tag-Based (Pressure_switch)\nRLC vs PLC: Hard-wired relays vs Programmable software | Fixed vs Modular I/O", SUCCESS_BG));
ch.push(h2("1.5 Mind Map — Module 1"));
ch.push(cod("PLC (Module 1)"));
ch.push(cod("├── Definition: Industrial digital computer for control"));
ch.push(cod("├── Advantages (7): Reliable,Flexible,Cheap,Comms,Fast,Debug,Test"));
ch.push(cod("├── Disadvantages (5): Complex,Limited power,Expandability,Cost,Program dep."));
ch.push(cod("├── Architecture: CPU + Memory + I/O + Power + Programming Device"));
ch.push(cod("├── Scan Cycle: INPUT → EXEC → OUTPUT → HOUSEKEEPING"));
ch.push(cod("├── Memory: RAM | ROM | EEPROM | Flash"));
ch.push(cod("├── I/O Types: Discrete (ON/OFF) | Analog (continuous)"));
ch.push(cod("├── Fixed vs Modular I/O"));
ch.push(cod("└── Addressing: Rack/Slot (I:1/1) | Tag-based (Pressure_switch)"));
ch.push(h2("1.6 Memory Tricks — Module 1"));
ch.push(colorBox("Architecture: 'C-M-I-O-P-P' = CPU, Memory, Input, Output, Power supply, Programming device\nScan: 'I-PEO-H' = Input, Program Execution, Output, Housekeeping\nRLC vs PLC: 'Relays are HARD, PLCs are SOFT' (Hard-wired vs Software)\nFIXED = small cheap fixed | MODULAR = flexible expandable\nAddressing: 'Rack is Old, Tag is New'", KEY_BG));
ch.push(pgBreak());

// ============ MODULE 2 ============
ch.push(h1("MODULE 2: PLC Programming Fundamentals & Logic Operations"));
ch.push(h2("2.1 Theory Notes"));
ch.push(h3("Ladder Logic Components"));
ch.push(mkTable(["Component", "Symbol", "Function"], [
    ["Power Rails (L1,L2)", "Vertical lines", "Power supply rails; left=hot, right=neutral"],
    ["Rung", "Horizontal line", "Logic path between L1 and L2"],
    ["NO Contact", "[ ] or --|[|--", "Passes when bit=1 (device ON)"],
    ["NC Contact", "[/] or --|/|--", "Passes when bit=0 (device OFF)"],
    ["Output Coil", "( ) or --( )--", "ON when rung logic TRUE; OFF when FALSE"],
    ["Latch Coil", "(L) or --(L)--", "Turns ON, stays ON until explicitly reset"],
    ["Unlatch Coil", "(U) or --(U)--", "Turns OFF a previously latched coil"],
    ["Timer Block", "[TON/TOF/RTO]", "Time delay functions"],
    ["Counter Block", "[CTU/CTD/RES]", "Event counting functions"],
], [2000, 2000, 5360]));
ch.push(empty());
ch.push(h3("Logic Gates in Ladder Logic"));
ch.push(cod("AND: L1 ---[ A ]---[ B ]---( Y )--- L2   |  Boolean: Y=A.B"));
ch.push(cod("OR:  L1 ---[ A ]---+---( Y )--- L2       |  Boolean: Y=A+B"));
ch.push(cod("        ---[ B ]--+"));
ch.push(cod("NOT: L1 ---[/A ]---( Y )--- L2           |  Boolean: Y=A'"));
ch.push(cod("NAND:L1 ---+---[/A]---+---( Y )--- L2   |  Boolean: Y=(AB)'"));
ch.push(cod("        ---+---[/B]--+"));
ch.push(cod("NOR: L1 ---[/A ]---[/B ]---( Y )--- L2  |  Boolean: Y=(A+B)'"));
ch.push(cod("XOR: L1 ---[ A ]---[/B]---+---( Y )--- L2 | Boolean: Y=A'B+AB'"));
ch.push(cod("        ---[/A]---[ B]--+"));
ch.push(empty());

ch.push(h2("2.2 All Questions — Module 2"));
[["M2-Q1", "Explain contact and coils in PLC ladder logic.", "2", "10", "IMPORTANT", "QP2", "1"],
["M2-Q2", "Demonstrate the logical AND, OR and NOT operations in ladder diagram with truth table.", "2", "10", "VERY IMPORTANT", "QP2", "2"],
["M2-Q3", "What are the main components of ladder logic and explain them?", "2", "14", "VERY IMPORTANT", "QP1", "1"],
["M2-Q4", "Draw ladder diagram for AND, OR, NOR logic functions.", "2", "6", "VERY IMPORTANT", "QP1", "1"],
["M2-Q5", "Draw ladder diagram for equations: (i)Y=(x1+x2)x3 (ii)Y=(x1+x2)(x3+x4) (iii)Y=(x1.x2)+x3", "2", "12", "IMPORTANT", "QP1", "1"],
["M2-Q6", "Draw ladder diagram for NAND, XOR logic functions.", "2", "8", "IMPORTANT", "QP1", "1"],
["M2-Q7", "What do you mean by latching and manual override in PLC programming?", "2", "10", "IMPORTANT", "QP2", "1"],
["M2-Q8", "Write a PLC program to control liquid level in a tank by pumping liquid into the tank.", "2", "10", "VERY IMPORTANT", "QP2", "1"],
["M2-Q9", "Explain the fundamental elements used in PLC ladder diagrams and their roles in control logic.", "2", "10", "IMPORTANT", "IAT", "1"],
["M2-Q10", "Develop Input/output programming for Forward-Reverse-Stop with Mutual Interlocks.", "2", "10", "VERY IMPORTANT", "IAT", "1"],
["M2-Q11", "Convert word description to ladder: Start→motor runs→continues until Stop→light ON.", "2", "10", "VERY IMPORTANT", "IAT", "1"],
["M2-Q12", "Draw relay diagram, ladder diagram and logic gates for: (i)Two limit switches in series controlling solenoid (ii)XOR Function", "2", "10", "IMPORTANT", "IAT", "1"],
].forEach(q => ch.push(qHdr(q[0], q[1], q[2], q[3], q[4], q[5], q[6])));
ch.push(empty());

ch.push(h2("2.3 Complete Answers — Module 2"));

ch.push(qHdr("M2-Q1", "Explain contact and coils in PLC ladder logic.", "2", "10", "IMPORTANT", "QP2", "1"));
ch.push(simpleBox("CONTACTS are like switches — they read the state of inputs. COILS are like motors/lamps — they are the outputs. When enough contacts allow current to flow, the coil at the end gets energized (turned ON)."));
ch.push(h4("Contacts:"));
ch.push(para("A contact represents the status of a specific memory bit (corresponding to a physical input or internal coil). Contacts do NOT consume power — they simply sense the status of a bit. Two main types: NO (Normally Open) and NC (Normally Closed)."));
ch.push(mkTable(["Type", "Symbol", "Behavior"], [["NO (Normally Open)", "[ ] or --|[|--", "CLOSED (passes) when bit=1 (input energized)"], ["NC (Normally Closed)", "[/] or --|/|--", "CLOSED (passes) when bit=0 (input de-energized)"], ["Positive Transition", "[↑]", "Passes for ONE scan when bit goes 0→1"], ["Negative Transition", "[↓]", "Passes for ONE scan when bit goes 1→0"]], [2500, 2500, 4360]));
ch.push(h4("Coils:"));
ch.push(para("A coil represents an output instruction. When rung logic evaluates as TRUE, the coil is energized (bit set to 1). When rung is FALSE, coil is de-energized (bit set to 0)."));
ch.push(mkTable(["Type", "Symbol", "Behavior"], [["Output Coil", "( )", "Energized when rung TRUE; de-energized when FALSE"], ["Latch (Set) Coil", "(L)", "Turns ON and STAYS ON even when rung goes FALSE"], ["Unlatch (Reset) Coil", "(U)", "Turns OFF a previously latched coil"], ["Retentive Coil", "(M)", "Retains state across power cycles"]], [2500, 1000, 5860]));
ch.push(h4("Example — Start-Stop Circuit showing Contacts and Coils:"));
ch.push(drawNote());
ch.push(cod("         STOP(NC)  START(NO)  MOTOR_AUX(NO)  MOTOR_CTR(coil)"));
ch.push(cod("L1 ---[/STOP]---[START]---+---( MOTOR )--- L2"));
ch.push(cod("                           |"));
ch.push(cod("               ---[MOTOR]--+  (seal-in/latch contact)"));
ch.push(cod(""));
ch.push(cod("STOP: NC contact — normally passes, OPENS when STOP pressed → breaks circuit"));
ch.push(cod("START: NO contact — normally open, CLOSES when START pressed → starts motor"));
ch.push(cod("MOTOR_AUX: NO contact — closes when motor output is ON → keeps motor running"));
ch.push(cod("MOTOR_CTR: Output coil — drives the actual motor contactor relay"));
ch.push(keyBox("NO contact, NC contact, Output coil, Latch coil, Unlatch coil, Positive transition, Rung, Rails, Logic continuity, Energized, De-energized, Seal-in"));
ch.push(empty());

ch.push(qHdr("M2-Q2/Q4", "Demonstrate AND, OR, NOT (and NOR) operations in ladder diagram with truth table.", "2", "10+6", "VERY IMPORTANT", "QP1, QP2", "2+"));
ch.push(simpleBox("AND = ALL contacts in series must close. OR = ANY one parallel contact closed. NOT = NC contact (inverse logic). Truth tables show all possible combinations. Boolean equations describe the logic mathematically."));
ch.push(h4("1. AND Gate:"));
ch.push(drawNote());
ch.push(cod("Boolean: Y = A . B  (A AND B)"));
ch.push(cod("L1 ---[ A ]---[ B ]---( Y )--- L2"));
ch.push(cod("      (NO)    (NO)    (coil)"));
ch.push(cod("Truth Table: A=0,B=0→Y=0 | A=0,B=1→Y=0 | A=1,B=0→Y=0 | A=1,B=1→Y=1"));
ch.push(para("Both A AND B must be energized (contacts closed) for output Y to energize. Series connection."));
ch.push(h4("2. OR Gate:"));
ch.push(drawNote());
ch.push(cod("Boolean: Y = A + B  (A OR B)"));
ch.push(cod("L1 ---[ A ]---+---( Y )--- L2"));
ch.push(cod("      ---[ B ]--+  (parallel branches)"));
ch.push(cod("Truth Table: A=0,B=0→Y=0 | A=0,B=1→Y=1 | A=1,B=0→Y=1 | A=1,B=1→Y=1"));
ch.push(para("Either A or B (or both) closed allows current to flow to Y. Parallel connection."));
ch.push(h4("3. NOT Gate:"));
ch.push(drawNote());
ch.push(cod("Boolean: Y = A'  (NOT A)"));
ch.push(cod("L1 ---[/A ]---( Y )--- L2  (NC contact of A)"));
ch.push(cod("Truth Table: A=0→Y=1  |  A=1→Y=0"));
ch.push(para("NC (Normally Closed) contact of A is used. When A is OFF (bit=0), NC is closed, Y=ON. When A is ON (bit=1), NC opens, Y=OFF."));
ch.push(h4("4. NOR Gate:"));
ch.push(drawNote());
ch.push(cod("Boolean: Y = (A+B)' = A'.B'  (NOR)"));
ch.push(cod("L1 ---[/A ]---[/B ]---( Y )--- L2  (NC contacts in series)"));
ch.push(cod("Truth Table: A=0,B=0→Y=1 | A=0,B=1→Y=0 | A=1,B=0→Y=0 | A=1,B=1→Y=0"));
ch.push(para("Both NC contacts must be closed (both inputs OFF) for output to be ON. If either input energizes, its NC contact opens, breaking the rung."));
ch.push(keyBox("AND=series, OR=parallel, NOT=NC contact, NOR=NC series, NAND=NC parallel, Boolean equation, Truth table, NO, NC, Rung logic"));
ch.push(empty());

ch.push(qHdr("M2-Q3", "What are the main components of ladder logic and explain them?", "2", "14", "VERY IMPORTANT", "QP1", "1"));
ch.push(simpleBox("Ladder logic is the main PLC programming language. It looks like a relay schematic. Main components: Power Rails (power supply), Rungs (logic paths), Contacts (input sensing), Coils (output actions), and Function Blocks (timers, counters, math)."));
ch.push(h4("Components of Ladder Logic Diagram:"));
ch.push(drawNote());
ch.push(cod("     L1 (Left Rail)                          L2 (Right Rail)"));
ch.push(cod("      |                                            |"));
ch.push(cod("Rung1 |---[ A ]---[ B ]---+---( OUTPUT )---------|"));
ch.push(cod("      |                   |                       |"));
ch.push(cod("      |         ---[ C ]--+  (parallel branch)    |"));
ch.push(cod("      |                                           |"));
ch.push(cod("Rung2 |---[/STOP]---[START]---+---( MOTOR )------|"));
ch.push(cod("      |                       |                   |"));
ch.push(cod("      |           ---[MOTOR]--+ (seal-in)         |"));
ch.push(cod("      |                                           |"));
ch.push(cod("Rung3 |---[MOTOR]---[T4:0 TON Pre=10 TB=1s]------|  (timer)"));
ch.push(cod("      |                                           |"));
ch.push(cod("Rung4 |---[T4:0/DN]---( ALARM )------------------|  (timer done)"));
ch.push(h4("1. Power Rails (L1, L2):"));
ch.push(para("Two vertical lines representing the power supply. L1 = left rail (hot side), L2 = right rail (neutral side). All rungs connect horizontally between these rails. Current flows left-to-right through each rung when conditions are met."));
ch.push(h4("2. Rungs:"));
ch.push(para("Horizontal lines connecting L1 to L2. Each rung represents one independent control logic statement. A rung contains contacts (input conditions) on the left and an output instruction (coil or function block) on the right. When a continuous logical path exists from L1 to L2, the output energizes."));
ch.push(h4("3. Contacts (Input Elements):"));
ch.push(para("Contacts represent conditions being monitored. NO Contact (passes when bit=1 / device ON). NC Contact (passes when bit=0 / device OFF). Positive Transition (passes for ONE scan on 0→1 change). Negative Transition (passes for ONE scan on 1→0 change). Series contacts = AND logic. Parallel contacts = OR logic."));
ch.push(h4("4. Coils (Output Elements):"));
ch.push(para("Coils represent output actions. Output Coil (ON when rung TRUE, OFF when FALSE). Latch Coil (Set — turns ON, stays ON). Unlatch Coil (Reset — turns OFF a latched coil). Retentive Coil (maintains state across power cycle)."));
ch.push(h4("5. Timer Function Blocks:"));
ch.push(para("Timer blocks introduce time delays. TON (Timer On-Delay — output turns ON after preset time). TOF (Timer Off-Delay — output turns OFF after preset time). RTO (Retentive Timer — accumulates time even when rung goes FALSE). Each has Time Base, Preset, and Accumulated parameters."));
ch.push(cod("Timer Symbol:"));
ch.push(cod("L1 ---[ COND ]---[TON          ]--- L2"));
ch.push(cod("                  Timer  : T4:0"));
ch.push(cod("                  TimeBase: 1.0s"));
ch.push(cod("                  Preset  : 10"));
ch.push(cod("                  Accum   : 0"));
ch.push(h4("6. Counter Function Blocks:"));
ch.push(para("Counter blocks count events. CTU (Count Up — increments on each 0→1 transition). CTD (Count Down — decrements). RES (Reset — clears accumulated count to zero). Each has Preset and Accumulated values. DN bit fires when Accumulated >= Preset."));
ch.push(h4("7. Arithmetic and Logic Function Blocks:"));
ch.push(para("ADD, SUB, MUL, DIV (arithmetic). MOVE (copy data). CMP, EQU, GEQ, LES (comparisons). Each has Source A, Source B, and Destination parameters. Activated when their input rung is TRUE."));
ch.push(keyBox("Power rails (L1/L2), Rungs, NO contact, NC contact, Output coil, Latch coil, TON, TOF, RTO, CTU, CTD, RES, ADD, SUB, MUL, DIV, MOVE, Scan cycle, Logic continuity"));
ch.push(empty());

ch.push(qHdr("M2-Q5", "Draw ladder diagram for Boolean equations: (i)Y=(x1+x2)x3 (ii)Y=(x1+x2)(x3+x4) (iii)Y=(x1.x2)+x3", "2", "12", "IMPORTANT", "QP1", "1"));
ch.push(simpleBox("+ (OR) = parallel contacts; . (AND) = series contacts. Parentheses group contacts. Draw each group as contacts, combine with series/parallel connections."));
ch.push(h4("(i) Y = (x1+x2).x3  —  two inputs OR'd, then AND'd with x3:"));
ch.push(drawNote());
ch.push(cod("L1 ---+--[ x1 ]--+---[ x3 ]---( Y )--- L2"));
ch.push(cod("       |          |"));
ch.push(cod("       +--[ x2 ]--+"));
ch.push(cod("  (x1 OR x2 in parallel) then AND with x3 in series"));
ch.push(para("Output Y is ON when (x1 OR x2) AND x3 are all true."));
ch.push(h4("(ii) Y = (x1+x2).(x3+x4)  —  two OR groups AND'd together:"));
ch.push(drawNote());
ch.push(cod("L1 ---+--[ x1 ]--+---+--[ x3 ]--+---( Y )--- L2"));
ch.push(cod("       |          |   |           |"));
ch.push(cod("       +--[ x2 ]--+   +--[ x4 ]--+"));
ch.push(cod("    (x1 OR x2)    AND    (x3 OR x4)"));
ch.push(para("Each OR group is represented as parallel contacts. Both groups in series (AND)."));
ch.push(h4("(iii) Y = (x1.x2)+x3  —  two inputs AND'd, then OR'd with x3:"));
ch.push(drawNote());
ch.push(cod("L1 ---[ x1 ]---[ x2 ]---+---( Y )--- L2"));
ch.push(cod("           ---[ x3 ]----+"));
ch.push(cod("  x1 AND x2 in series (top) OR x3 alone (bottom) — parallel branches"));
ch.push(para("Output Y is ON when either (x1 AND x2) OR x3 is TRUE."));
ch.push(keyBox("Series contacts=AND, Parallel contacts=OR, Boolean equation, Logic gates, Ladder conversion, Rungs, Branches, Parentheses grouping"));
ch.push(empty());

ch.push(qHdr("M2-Q6", "Draw ladder diagram for NAND, XOR logic functions.", "2", "8", "IMPORTANT", "QP1", "1"));
ch.push(simpleBox("NAND=AND then invert=NC contacts in parallel. XOR=exclusive OR=output ON when inputs DIFFER=two parallel rungs, each with one NC and one NO contact from different inputs."));
ch.push(h4("1. NAND Gate:"));
ch.push(drawNote());
ch.push(cod("Boolean: Y = (A.B)' = A' + B'"));
ch.push(cod("L1 ---+---[/A]---+---( Y )--- L2"));
ch.push(cod("       |         |"));
ch.push(cod("       +---[/B]--+  (NC contacts in parallel)"));
ch.push(cod("Truth Table:"));
ch.push(cod("  A=0,B=0 → Y=1  (both NC closed)"));
ch.push(cod("  A=0,B=1 → Y=1  (A's NC closed)"));
ch.push(cod("  A=1,B=0 → Y=1  (B's NC closed)"));
ch.push(cod("  A=1,B=1 → Y=0  (both NC open)"));
ch.push(h4("2. XOR Gate:"));
ch.push(drawNote());
ch.push(cod("Boolean: Y = A'B + AB' = A XOR B  (output ON when inputs DIFFER)"));
ch.push(cod("L1 ---[ A ]---[/B]---+---( Y )--- L2  (A=ON, B=OFF → Y=ON)"));
ch.push(cod("      ---[/A]---[ B]--+              (A=OFF, B=ON → Y=ON)"));
ch.push(cod(""));
ch.push(cod("Gate Logic:  A ─┐"));
ch.push(cod("                [XOR]─── Y"));
ch.push(cod("             B ─┘"));
ch.push(cod("Truth Table:"));
ch.push(cod("  A=0,B=0 → Y=0  (same)      A=0,B=1 → Y=1  (different)"));
ch.push(cod("  A=1,B=0 → Y=1  (different) A=1,B=1 → Y=0  (same)"));
ch.push(keyBox("NAND, XOR, NC contacts parallel, Boolean algebra, De Morgan's theorem, Exclusive OR, XOR truth table, A'B+AB'"));
ch.push(empty());

ch.push(qHdr("M2-Q7", "What do you mean by latching and manual override in PLC programming?", "2", "10", "IMPORTANT", "QP2", "1"));
ch.push(simpleBox("Latching = once ON, stays ON even after button released (like a door latch staying locked). Manual override = technician can force an output ON or OFF regardless of the PLC program — used for maintenance and testing."));
ch.push(h4("Latching in PLC:"));
ch.push(para("Latching (also called sealing or self-holding) is a technique where an output turns ON and REMAINS ON even after the input signal that turned it on is removed."));
ch.push(h4("Method 1 — Seal-In Contact:"));
ch.push(drawNote());
ch.push(cod("L1 ---[/STOP]---[START]---+---( MOTOR )--- L2"));
ch.push(cod("                           |"));
ch.push(cod("               ---[MOTOR]--+  (seal-in/self-holding contact)"));
ch.push(cod("Operation:"));
ch.push(cod("  1. Press START → MOTOR coil energizes"));
ch.push(cod("  2. MOTOR auxiliary contact closes → seals in the circuit"));
ch.push(cod("  3. Release START → MOTOR seal-in keeps circuit energized (motor stays ON)"));
ch.push(cod("  4. Press STOP → NC contact opens → MOTOR de-energizes"));
ch.push(h4("Method 2 — Latch/Unlatch Coils:"));
ch.push(cod("Rung 1: L1 ---[START]---( MOTOR )L--- L2  (Latch coil — motor turns ON+stays ON)"));
ch.push(cod("Rung 2: L1 ---[STOP ]---( MOTOR )U--- L2  (Unlatch coil — motor turns OFF)"));
ch.push(h4("Manual Override:"));
ch.push(para("Manual override allows an operator or technician to force an input or output to a specific state regardless of current program logic. Used during commissioning, testing, and maintenance."));
ch.push(h4("Types of Manual Override:"));
ch.push(blt("Hardware Override: Physical switch on I/O module that forces output ON or OFF"));
ch.push(blt("Software Force: Programming software allows forcing a bit to 0 or 1 from PC; marked with special indicator"));
ch.push(blt("Disable/Enable: Override can be enabled/disabled from programming terminal"));
ch.push(h4("Applications:"));
ch.push(blt("Testing output devices before program is complete"));
ch.push(blt("Bypassing faulty sensor temporarily to keep production running"));
ch.push(blt("Manually jogging a motor for alignment during maintenance"));
ch.push(keyBox("Latch coil, Unlatch coil, Seal-in contact, Self-holding, Momentary contact, Manual override, Hardware force, Software force, Bit forcing, Commissioning"));
ch.push(empty());

ch.push(qHdr("M2-Q8", "Write a PLC program to control liquid level in a tank by pumping liquid into the tank.", "2", "10", "VERY IMPORTANT", "QP2", "1"));
ch.push(simpleBox("Classic PLC program! LOW level sensor starts pump. HIGH level sensor stops pump. A seal-in contact keeps pump running as level rises past LS_LOW. This prevents rapid pump ON/OFF cycling (hysteresis control)."));
ch.push(h4("I/O Assignment:"));
ch.push(mkTable(["I/O", "Device", "Address"], [["INPUT", "LS_LOW — Low level switch (closes when level LOW)", "I:0/0"], ["INPUT", "LS_HIGH — High level switch (closes when level HIGH)", "I:0/1"], ["OUTPUT", "PUMP — Pump motor contactor", "O:0/0"]], [2000, 5000, 2360]));
ch.push(h4("Ladder Diagram:"));
ch.push(drawNote());
ch.push(cod("RUNG 1: Start pump when level is LOW, stop when HIGH"));
ch.push(cod("L1 ---[/LS_HIGH]---[LS_LOW]---+---( PUMP )--- L2"));
ch.push(cod("                               |"));
ch.push(cod("               ---[PUMP_AUX]--+  (seal-in)"));
ch.push(cod(""));
ch.push(cod("  LS_HIGH: NC contact — breaks circuit when HIGH level reached → pump stops"));
ch.push(cod("  LS_LOW:  NO contact — closes when level is low → starts pump"));
ch.push(cod("  PUMP_AUX: seal-in → keeps pump running as level rises past LS_LOW sensor"));
ch.push(cod(""));
ch.push(cod("RUNG 2: Indicator light shows pump running"));
ch.push(cod("L1 ---[PUMP_AUX]---( PUMP_LIGHT )--- L2"));
ch.push(h4("Operation Sequence:"));
ch.push(blt("Tank empty: LS_LOW closes (low level) → PUMP starts → PUMP_AUX seals in"));
ch.push(blt("Level rising: PUMP stays ON via seal-in contact"));
ch.push(blt("High level reached: LS_HIGH closes → NC contact in rung 1 OPENS → PUMP stops"));
ch.push(blt("Tank drains in use: LS_HIGH opens, but pump waits until LS_LOW activates again"));
ch.push(blt("Level drops to LOW: LS_LOW closes again → PUMP restarts (cycle repeats)"));
ch.push(h4("Timing Diagram:"));
ch.push(cod("Level:    LOW___/RISING_____________HIGH___DRAINING___LOW"));
ch.push(cod("LS_LOW:   ON     OFF          OFF   OFF    OFF        ON"));
ch.push(cod("LS_HIGH:  OFF    OFF          OFF   ON     OFF        OFF"));
ch.push(cod("PUMP:     ON     ON(seal-in)  ON    OFF    OFF        ON"));
ch.push(keyBox("LS_LOW, LS_HIGH, Pump, Seal-in contact, Level control, Latch, NC contact, Automatic restart, Hysteresis, Tank level control"));
ch.push(empty());

ch.push(qHdr("M2-Q9", "Explain the fundamental elements used in PLC ladder diagrams and their roles in control logic.", "2", "10", "IMPORTANT", "IAT", "1"));
ch.push(simpleBox("Elements = the building blocks of ladder logic. Power rails provide power, rungs are the logic paths, contacts are conditions being checked, coils are the actions taken, and function blocks handle complex operations like timing and counting."));
ch.push(h4("Fundamental Elements:"));
ch.push(para("Ladder Diagram (LD) is the most widely used PLC programming language. It is graphical, resembling relay logic schematics. The elements are:"));
ch.push(h4("1. Power Rails (L1, L2):"));
ch.push(para("Two vertical lines: L1 (Left rail — high potential / hot side) and L2 (Right rail — low potential / neutral). All rungs extend horizontally between these rails. Represent the power supply — current flows from L1 to L2 through each rung when logic is satisfied."));
ch.push(h4("2. Contacts:"));
ch.push(para("Sensing elements. Check status of bits in PLC memory (which correspond to physical inputs or internal coils). NO contact passes TRUE when bit=1. NC contact passes TRUE when bit=0. Used in series for AND logic, in parallel for OR logic."));
ch.push(drawNote());
ch.push(cod("L1 ---|[A]---|[B]---|/C|---( OUTPUT )--- L2"));
ch.push(cod("    NO(A)  NO(B)  NC(C)    coil"));
ch.push(cod("Rungs connect from L1 to L2; outputs energize when full logical path exists"));
ch.push(h4("3. Output Coils:"));
ch.push(para("Action elements. When the rung provides a logical path (TRUE), the output coil energizes (bit=1). This drives the corresponding physical output device. When path is broken (FALSE), coil de-energizes (bit=0)."));
ch.push(h4("4. Latch and Unlatch Coils:"));
ch.push(para("Special coil types for maintaining state. Latch (L) coil: turns ON and stays ON even if rung goes FALSE. Unlatch (U) coil: turns OFF a latched coil. Used for retentive control like motor start-stop."));
ch.push(h4("5. Timer Function Blocks:"));
ch.push(para("Provide timed actions. TON (On-delay timer), TOF (Off-delay timer), RTO (Retentive timer). Parameters: Time Base (1s, 0.1s), Preset (target count), Accumulated (current count). DN bit fires when Accumulated = Preset."));
ch.push(h4("6. Counter Function Blocks:"));
ch.push(para("Count events. CTU (Count Up), CTD (Count Down), RES (Reset). DN bit fires when Accumulated >= Preset."));
ch.push(h4("Roles in Control Logic:"));
ch.push(blt("Contacts implement condition checking — is this sensor ON? Is timer done?"));
ch.push(blt("Series contacts implement AND logic — ALL conditions must be TRUE"));
ch.push(blt("Parallel contacts implement OR logic — ANY condition being TRUE suffices"));
ch.push(blt("NC contacts implement NOT logic — condition TRUE when device is OFF"));
ch.push(blt("Coils implement output actions — drive physical devices"));
ch.push(blt("Function blocks implement complex control — timing, counting, math"));
ch.push(keyBox("Power rails, Rungs, NO contact, NC contact, Output coil, Latch coil, Timer block, Counter block, Series logic, Parallel logic, Function block, IEC 61131-3"));
ch.push(empty());

ch.push(qHdr("M2-Q10", "Develop Input/output programming for Forward-Reverse-Stop with Mutual Interlocks.", "2", "10", "VERY IMPORTANT", "IAT", "1"));
ch.push(simpleBox("Forward-Reverse: motor can run in both directions. Mutual interlock = safety feature preventing BOTH from being ON simultaneously (which would short circuit). Each direction rung has NC contact of the OTHER direction in it."));
ch.push(h4("I/O Assignment:"));
ch.push(mkTable(["I/O", "Device", "Address"], [["INPUT", "STOP pushbutton (NC — fails safe)", "I:0/0"], ["INPUT", "FWD pushbutton (NO)", "I:0/1"], ["INPUT", "REV pushbutton (NO)", "I:0/2"], ["OUTPUT", "FWD_CTR — Forward motor contactor", "O:0/0"], ["OUTPUT", "REV_CTR — Reverse motor contactor", "O:0/1"]], [2000, 5000, 2360]));
ch.push(h4("Ladder Diagram with Mutual Interlocks:"));
ch.push(drawNote());
ch.push(cod("RUNG 1: Forward Control"));
ch.push(cod("L1 --[/STOP]--[FWD_BTN]--[/REV_CTR]--+--( FWD_CTR )-- L2"));
ch.push(cod("                                       |"));
ch.push(cod("                      ----[FWD_CTR]---+  (seal-in)"));
ch.push(cod(""));
ch.push(cod("RUNG 2: Reverse Control"));
ch.push(cod("L1 --[/STOP]--[REV_BTN]--[/FWD_CTR]--+--( REV_CTR )-- L2"));
ch.push(cod("                                       |"));
ch.push(cod("                      ----[REV_CTR]---+  (seal-in)"));
ch.push(h4("Explanation of Functionality:"));
ch.push(para("STOP (NC): Normally closed, circuit complete in normal operation. Pressing STOP opens this contact, cutting power to both rungs and stopping motor."));
ch.push(para("Forward Operation: When FWD_BTN pressed, if REV_CTR is NOT energized ([/REV_CTR] NC is closed), FWD_CTR coil energizes. Seal-in contact closes — motor runs forward even after FWD_BTN released."));
ch.push(para("Mutual Interlock: [/REV_CTR] NC in Rung 1 = forward interlock. If reverse motor is ever energized, this contact OPENS, preventing forward from starting simultaneously. Similarly [/FWD_CTR] in Rung 2."));
ch.push(para("Stopping: Press STOP → NC contact opens → both rungs FALSE → motor stops immediately."));
ch.push(h4("Connection Table (I/O List):"));
ch.push(mkTable(["Address", "Tag Name", "Device"], [["I:0/0", "STOP_BTN", "NC pushbutton to input 0"], ["I:0/1", "FWD_BTN", "NO pushbutton to input 1"], ["I:0/2", "REV_BTN", "NO pushbutton to input 2"], ["O:0/0", "FWD_CTR", "Forward contactor coil from output 0"], ["O:0/1", "REV_CTR", "Reverse contactor coil from output 1"]], [2000, 3000, 4360]));
ch.push(keyBox("Mutual interlock, Forward-Reverse, Contactor, Seal-in, NC interlock contact, Motor control, STOP (NC), Safety interlock, Simultaneous energizing prevention"));
ch.push(empty());

ch.push(qHdr("M2-Q11", "Convert word description to ladder: Start→motor runs→continues until Stop→light ON while running.", "2", "10", "VERY IMPORTANT", "IAT", "1"));
ch.push(simpleBox("Word to ladder: Identify inputs (Start, Stop), identify outputs (Motor, Light), identify conditions (motor must latch = stays on after Start released). STOP is always NC for safety."));
ch.push(h4("Word Description Analysis:"));
ch.push(blt("When START is pressed → MOTOR should run"));
ch.push(blt("MOTOR continues running until STOP is pressed (need latch/seal-in)"));
ch.push(blt("A LIGHT should also turn ON while the motor is running"));
ch.push(h4("I/O Identification:"));
ch.push(mkTable(["I/O", "Device", "Type", "Address"], [["INPUT", "STOP button", "NC (normally closed, fail-safe)", "I:0/0"], ["INPUT", "START button", "NO (momentary push)", "I:0/1"], ["OUTPUT", "MOTOR", "Output coil (motor contactor)", "O:0/0"], ["OUTPUT", "LIGHT", "Output coil (indicator lamp)", "O:0/1"]], [1500, 3000, 2000, 2860]));
ch.push(h4("Relay Logic (Elementary Diagram):"));
ch.push(drawNote());
ch.push(cod("L1                                         L2"));
ch.push(cod("|--[/STOP]---[START]---+---( MOTOR )------|"));
ch.push(cod("|                      |                   |"));
ch.push(cod("|         ---[M_AUX]---+  (M-Aux seal-in)  |"));
ch.push(cod("|                                          |"));
ch.push(cod("|--[MOTOR_AUX]---( LIGHT )-----------------|"));
ch.push(h4("PLC Ladder Logic Program:"));
ch.push(drawNote());
ch.push(cod("RUNG 1: Motor Start-Stop Seal Circuit"));
ch.push(cod("L1 ---[/STOP]---[START]---+---( MOTOR )--- L2"));
ch.push(cod("                           |"));
ch.push(cod("               ---[MOTOR]--+  (seal-in)"));
ch.push(cod(""));
ch.push(cod("RUNG 2: Light follows Motor (light ON while motor running)"));
ch.push(cod("L1 ---[MOTOR]---( LIGHT )--- L2"));
ch.push(h4("Step-by-Step Operation:"));
ch.push(blt("Step 1: All at rest — STOP NC is closed (passes), START NO is open, MOTOR coil de-energized"));
ch.push(blt("Step 2: Press START — START closes → path: [/STOP][START] complete → MOTOR coil energizes"));
ch.push(blt("Step 3: MOTOR bit=1 → MOTOR seal-in contact closes → circuit sealed in (latched)"));
ch.push(blt("Step 4: Release START → seal-in keeps circuit closed → motor continues running"));
ch.push(blt("Step 5: MOTOR bit=1 → Rung 2: MOTOR contact closed → LIGHT energizes → turns ON"));
ch.push(blt("Step 6: Press STOP → NC contact opens → Rung 1 broken → MOTOR de-energizes → seal-in opens → LIGHT turns OFF"));
ch.push(keyBox("Start-Stop-Seal, Word-to-ladder conversion, Seal-in contact, Auxiliary contact, Motor control, STOP (NC), Indicator light, Latch, I/O identification, Elementary diagram"));
ch.push(empty());

ch.push(qHdr("M2-Q12", "Draw relay diagram, ladder diagram and logic gates for: (i)Two limit switches series controlling solenoid (ii)XOR Function", "2", "10", "IMPORTANT", "IAT", "1"));
ch.push(simpleBox("Series limit switches = AND gate. Both must be actuated to energize solenoid. XOR = output ON when inputs are DIFFERENT. Each part gets: relay schematic + ladder logic + gate symbol + Boolean equation."));
ch.push(h4("(i) Two Limit Switches in Series — Controlling a Solenoid:"));
ch.push(drawNote());
ch.push(cod("Boolean Equation: Y = LS1 . LS2  (AND gate)"));
ch.push(cod(""));
ch.push(cod("Relay Schematic:"));
ch.push(cod("  LS1      LS2    SOL(solenoid)"));
ch.push(cod("  ─o o─────o o───( )──  (series switches control solenoid coil)"));
ch.push(cod(""));
ch.push(cod("Ladder Logic Program:"));
ch.push(cod("       A(LS1)   B(LS2)    Y(SOL)"));
ch.push(cod("  L1 --[ LS1 ]--[ LS2 ]---( SOL )-- L2"));
ch.push(cod("       (NO)     (NO)      (coil)"));
ch.push(cod(""));
ch.push(cod("Gate Logic (AND gate):"));
ch.push(cod("  LS1 ─┐"));
ch.push(cod("       [AND]─── SOL (Y)"));
ch.push(cod("  LS2 ─┘"));
ch.push(cod(""));
ch.push(cod("Truth Table:"));
ch.push(cod("  LS1 | LS2 | SOL = LS1.LS2"));
ch.push(cod("   0  |  0  |    0"));
ch.push(cod("   0  |  1  |    0"));
ch.push(cod("   1  |  0  |    0"));
ch.push(cod("   1  |  1  |    1  ← Both switches actuated → solenoid ON"));
ch.push(para("Application: Safety interlock — both machine guards must be closed (both limit switches actuated) before solenoid actuates. Common in press machines and automated gates."));
ch.push(h4("(ii) XOR (Exclusive OR) Function:"));
ch.push(drawNote());
ch.push(cod("Boolean Equation: Y = A'B + AB' = A XOR B"));
ch.push(cod(""));
ch.push(cod("Relay Schematic:"));
ch.push(cod("  Two parallel paths: one with PB1.PB2' and one with PB1'.PB2"));
ch.push(cod("  PB1  PB2'         PB1'  PB2"));
ch.push(cod("  o-o  o-|o──(Y)    o-|o  o-o──(Y)  [parallel paths]"));
ch.push(cod(""));
ch.push(cod("Ladder Logic Program:"));
ch.push(cod("  L1 ---[ A ]---[/B ]---+---( Y )--- L2  (A=ON, B=OFF → Y=ON)"));
ch.push(cod("        ---[/A ]---[ B ]--+              (A=OFF, B=ON → Y=ON)"));
ch.push(cod(""));
ch.push(cod("Gate Logic:"));
ch.push(cod("  A ─┐"));
ch.push(cod("     [XOR]─── Y"));
ch.push(cod("  B ─┘"));
ch.push(cod("  Boolean: Y = A XOR B = A'B + AB'"));
ch.push(cod(""));
ch.push(cod("Truth Table:"));
ch.push(cod("  A | B | Y = A XOR B"));
ch.push(cod("  0 | 0 |     0      (same)"));
ch.push(cod("  0 | 1 |     1      (different)"));
ch.push(cod("  1 | 0 |     1      (different)"));
ch.push(cod("  1 | 1 |     0      (same)"));
ch.push(keyBox("LS1 AND LS2, Series connection, AND gate, Boolean equation, XOR, Exclusive OR, A'B+AB', NC contact, Relay schematic, Ladder diagram, Gate logic, Truth table, Boolean"));
ch.push(empty());

ch.push(h2("2.4 Quick Revision — Module 2"));
ch.push(colorBox("Contacts: NO [ ] passes when ON | NC [/] passes when OFF (inverse)\nCoils: Output ( ) | Latch (L) stays ON | Unlatch (U) turns OFF\nAND=series | OR=parallel | NOT=NC contact | NAND=NC parallel | NOR=NC series | XOR=(A.B')+(A'.B)\nStart-Stop: NC Stop + NO Start + seal-in contact\nForward-Reverse: mutual interlock = NC contact of other direction in each rung\nLiquid level: LS_LOW starts pump, LS_HIGH NC stops pump, seal-in keeps running", SUCCESS_BG));
ch.push(h2("2.5 Mind Map — Module 2"));
ch.push(cod("LADDER LOGIC (Module 2)"));
ch.push(cod("├── Elements: Rails, Rungs, Contacts, Coils, Function Blocks"));
ch.push(cod("├── Contacts: NO [ ] when ON | NC [/] when OFF"));
ch.push(cod("├── Coils: Output ( ) | Latch (L) | Unlatch (U)"));
ch.push(cod("├── Logic Gates in Ladder"));
ch.push(cod("│   ├── AND=series | OR=parallel | NOT=NC"));
ch.push(cod("│   ├── NAND=NC parallel | NOR=NC series"));
ch.push(cod("│   └── XOR=two parallel rungs (A.B' + A'.B)"));
ch.push(cod("├── Programs"));
ch.push(cod("│   ├── Start-Stop-Seal (motor latch)"));
ch.push(cod("│   ├── Forward-Reverse-Interlock"));
ch.push(cod("│   └── Liquid Level Control"));
ch.push(cod("└── Boolean → Ladder: + is parallel, . is series"));
ch.push(h2("2.6 Memory Tricks — Module 2"));
ch.push(colorBox("AND='ALL in a row' (series) | OR='ANY in parallel'\nNO vs NC: 'NO=Normal switch (open) | NC=Normal door (closed)'\nXOR: 'X marks the spot — DIFFERENT inputs give output'\nLatch: 'LATCH like a door latch — stays until UNLATCHED'\nMutual Interlock: 'Each one BLOCKS the other'", KEY_BG));
ch.push(pgBreak());

// ============ MODULE 3 ============
ch.push(h1("MODULE 3: PLC Arithmetic, Timer & Counter Functions"));
ch.push(h2("3.1 Theory Notes"));
ch.push(h3("Arithmetic Instructions"));
ch.push(mkTable(["Instruction", "Function", "Format"], [["ADD", "Source A + Source B → Destination", "SA,SB,Dest"], ["SUB", "Source A - Source B → Destination", "SA,SB,Dest"], ["MUL", "Source A × Source B → Destination", "SA,SB,Dest"], ["DIV", "Source A ÷ Source B → Destination (integer)", "SA,SB,Dest"], ["SQR", "SQRT(Source A) → Destination", "SA,Dest"], ["NEG", "-(Source A) → Destination", "SA,Dest"], ["CPT", "Evaluate expression → Destination", "Expr,Dest"], ["TOD", "Binary → BCD conversion", "SA,Dest"], ["FRD", "BCD → Binary conversion", "SA,Dest"]], [2000, 5000, 2360]));
ch.push(empty());
ch.push(h3("Timer Functions"));
ch.push(mkTable(["Type", "Trigger", "Output", "Reset"], [["TON (On-Delay)", "Rung TRUE → timer starts", "Turns ON after preset time", "Immediately when rung goes FALSE"], ["TOF (Off-Delay)", "Rung FALSE → timer starts", "Turns OFF after preset time", "Immediately when rung goes TRUE"], ["RTO (Retentive)", "Rung TRUE → timer starts", "ON after accumulated time", "Only with explicit RES instruction"]], [2000, 2500, 3000, 2360]));
ch.push(cod("Total Time = Preset Value × Time Base"));
ch.push(cod("Timer Bits: EN=Enable | TT=Timer Timing | DN=Done (Acc>=Pre)"));
ch.push(empty());
ch.push(h3("Counter Functions"));
ch.push(mkTable(["Type", "Action", "Done Bit"], [["CTU (Count Up)", "Increments Acc on each 0→1 transition", "DN when Acc >= Preset"], ["CTD (Count Down)", "Decrements Acc on each 0→1 transition", "DN when Acc <= 0"], ["RES (Reset)", "Clears Acc to zero, clears DN bit", "N/A"]], [3000, 4000, 2360]));
ch.push(empty());

ch.push(h2("3.2 All Questions — Module 3"));
[["M3-Q1", "How to use addition and subtraction blocks in PLC programming? Give example.", "3", "10", "VERY IMPORTANT", "QP2", "1"],
["M3-Q2", "Design a timer-based ladder diagram to control a conveyor belt with 5 seconds delay.", "3", "10", "VERY IMPORTANT", "QP2", "1"],
["M3-Q3", "Illustrate the up and down counter in PLC program with example of applications for each block.", "3", "10", "VERY IMPORTANT", "QP2", "1"],
["M3-Q4", "Write a PLC program using timer for ON/OFF control in a temperature regulation system.", "3", "10", "VERY IMPORTANT", "QP2", "1"],
["M3-Q5", "Example addition, subtraction, multiplication, division arithmetic operations in PLC.", "3", "12", "VERY IMPORTANT", "QP1", "1"],
["M3-Q6", "Explain Timer on Delay and Timer off Delay in PLC.", "3", "8", "VERY IMPORTANT", "QP1", "1"],
["M3-Q7", "Explain count up and count down in PLC.", "3", "10", "VERY IMPORTANT", "QP1", "1"],
["M3-Q8", "Explain PLC sequencer instruction.", "3", "10", "IMPORTANT", "QP1", "1"],
["M3-Q9", "Discuss the various mathematical functions and associated command structures used in PLC programming.", "3", "10", "IMPORTANT", "IAT", "1"],
["M3-Q10", "Design automation solution for temperature conversion logic in PLCs using mathematical operations.", "3", "10", "VERY IMPORTANT", "IAT", "1"],
["M3-Q11", "Demonstrate the application of a subtraction instruction to detect and respond to vessel overfill conditions.", "3", "10", "VERY IMPORTANT", "IAT", "1"],
["M3-Q12", "Sketch and explain PLC logic circuits for arithmetic operations ADD, MUL.", "3", "10", "IMPORTANT", "IAT", "1"],
].forEach(q => ch.push(qHdr(q[0], q[1], q[2], q[3], q[4], q[5], q[6])));
ch.push(empty());

ch.push(h2("3.3 Complete Answers — Module 3"));

ch.push(qHdr("M3-Q1/Q5/Q9", "Math operations in PLC: ADD, SUB, MUL, DIV with examples. Discuss mathematical functions.", "3", "10+12", "VERY IMPORTANT", "QP1, QP2, IAT", "3+"));
ch.push(simpleBox("PLC arithmetic works like a calculator inside the program. You choose ADD/SUB/MUL/DIV, tell it which registers hold the numbers, and where to put the result. Contacts in the rung control WHEN the math runs."));
ch.push(h4("Scope of Math Functions:"));
ch.push(para("PLCs perform mathematical operations on data stored in integer or floating-point registers. Essential for process calculations: scaling analog signals, computing physical quantities, performing unit conversions, and implementing control algorithms."));
ch.push(h4("Math Instruction Format (3 parameter fields):"));
ch.push(cod("[INSTRUCTION NAME]"));
ch.push(cod("  Source A    : N7:0  (register with first operand)"));
ch.push(cod("  Source B    : N7:1  (register with second operand)"));
ch.push(cod("  Destination : N7:2  (register to store result)"));
ch.push(h4("1. ADD (Addition) — Example:"));
ch.push(drawNote());
ch.push(cod("L1 ---[ SW ]---[ADD            ]--- L2"));
ch.push(cod("               ADD"));
ch.push(cod("               Source A  N7:0   25"));
ch.push(cod("               Source B  N7:1   50"));
ch.push(cod("               Dest      N7:2   75  ← result"));
ch.push(cod("Result: N7:2 = 25 + 50 = 75"));
ch.push(h4("2. SUB (Subtraction) — Example:"));
ch.push(drawNote());
ch.push(cod("L1 ---[ SW ]---[SUB            ]--- L2"));
ch.push(cod("               Source A  N7:1  100"));
ch.push(cod("               Source B  N7:0   30"));
ch.push(cod("               Dest      N7:3   70"));
ch.push(cod("Result: N7:3 = 100 - 30 = 70"));
ch.push(h4("3. MUL (Multiplication) — Example:"));
ch.push(cod("L1 ---[ SW ]---[MUL: SA=N7:1(123), SB=N7:2(60), Dest=N7:3(7380)]--- L2"));
ch.push(cod("Result: N7:3 = 123 × 60 = 7380"));
ch.push(h4("4. DIV (Division) — Example:"));
ch.push(cod("L1 ---[ SW ]---[DIV: SA=N7:1(100), SB=N7:2(4), Dest=N7:4(25)]--- L2"));
ch.push(cod("Result: N7:4 = 100 ÷ 4 = 25  (integer result, decimal truncated)"));
ch.push(h4("5. SQR, NEG, CPT, TOD, FRD:"));
ch.push(cod("SQR: Dest = SQRT(Source A)   e.g., SQRT(144)=12"));
ch.push(cod("NEG: Dest = -(Source A)       e.g., -(N7:0) changes sign"));
ch.push(cod("CPT: Dest = Expression        e.g., (N7:0+N7:1)*N7:2 in one block"));
ch.push(cod("TOD: Binary → BCD             e.g., for 7-segment LED displays"));
ch.push(cod("FRD: BCD → Binary             e.g., reading from thumbwheel switch"));
ch.push(h4("Summary Table:"));
ch.push(mkTable(["Command", "Function", "Use"], [["ADD", "SA + SB → Dest", "Totaling, accumulation"], ["SUB", "SA - SB → Dest", "Difference, level detection"], ["MUL", "SA × SB → Dest", "Scaling, power calculation"], ["DIV", "SA ÷ SB → Dest (int)", "Rate calculation, conversion"], ["SQR", "SQRT(SA) → Dest", "RMS calculations"], ["NEG", "-(SA) → Dest", "Sign change"], ["CPT", "Expression → Dest", "Complex formulas"], ["TOD", "Binary → BCD", "7-segment display output"], ["FRD", "BCD → Binary", "Thumbwheel switch input"]], [1500, 3500, 4360]));
ch.push(keyBox("ADD, SUB, MUL, DIV, SQR, NEG, CPT, Source A, Source B, Destination, N7 file, Integer register, FRD, TOD, Math block, Arithmetic instruction"));
ch.push(empty());

ch.push(qHdr("M3-Q2", "Design a timer-based ladder diagram to control a conveyor belt with 5 seconds delay.", "3", "10", "VERY IMPORTANT", "QP2", "1"));
ch.push(simpleBox("Press START → warning buzzer sounds for 5 seconds (workers clear area) → after 5s the conveyor belt starts. This is a TON (Timer On-Delay) application with seal-in contact."));
ch.push(h4("I/O Assignment:"));
ch.push(mkTable(["I/O", "Device", "Address"], [["INPUT", "START pushbutton (NO)", "I:0/0"], ["INPUT", "STOP pushbutton (NC, fail-safe)", "I:0/1"], ["OUTPUT", "BUZZER — warning during delay", "O:0/0"], ["OUTPUT", "CONVEYOR_MOTOR", "O:0/1"], ["TIMER", "T4:0 — 5-second TON timer", "T4:0"]], [2000, 4000, 3360]));
ch.push(h4("Ladder Diagram:"));
ch.push(drawNote());
ch.push(cod("RUNG 1: Start timer when START pressed (STOP not pressed)"));
ch.push(cod("L1 ---[/STOP]---[START]---+---[TON          ]--- L2"));
ch.push(cod("                           |   Timer   T4:0"));
ch.push(cod("           ---[T4:0/EN]---+   TimBase 1.0s"));
ch.push(cod("                               Preset    5"));
ch.push(cod("                               Accum     0"));
ch.push(cod("  (T4:0/EN seal-in — timer keeps running after START released)"));
ch.push(cod(""));
ch.push(cod("RUNG 2: Buzzer ON during 5s timing (EN=ON but DN=OFF)"));
ch.push(cod("L1 ---[T4:0/EN]---[/T4:0/DN]---( BUZZER )--- L2"));
ch.push(cod("  (EN=timer running, /DN=not yet done → buzzer sounds as warning)"));
ch.push(cod(""));
ch.push(cod("RUNG 3: Conveyor starts AFTER 5s delay (DN bit)"));
ch.push(cod("L1 ---[T4:0/DN]---+---( CONVEYOR )--- L2"));
ch.push(cod("                   |"));
ch.push(cod("  ---[CONVEYOR]---+  (seal-in keeps conveyor running)"));
ch.push(cod(""));
ch.push(cod("RUNG 4: STOP resets everything (NC contact in Rung 1 handles stop)"));
ch.push(h4("Timing Diagram:"));
ch.push(cod("START:          |_____________"));
ch.push(cod("T4:0 EN:        |_________|   "));
ch.push(cod("T4:0 DN:                 |____"));
ch.push(cod("BUZZER:         |_________|   (sounds during 5s delay)"));
ch.push(cod("CONVEYOR:                |____ (starts after 5s)"));
h4("Operation:");
ch.push(blt("Press START: T4:0 timer begins. EN bit sets → BUZZER ON (warning). T4:0/EN seal-in keeps timer running after START released"));
ch.push(blt("After 5 seconds: T4:0 accumulated = 5 → DN bit sets → CONVEYOR coil energizes → belt starts. BUZZER stops (DN=ON breaks Rung 2 since [/T4:0/DN] opens)"));
ch.push(blt("Press STOP: NC contact in Rung 1 opens → timer resets → EN and DN bits clear → conveyor stops"));
ch.push(keyBox("TON, Timer On-Delay, Enable (EN), Timer Timing (TT), Done (DN), Preset, Accumulated, Time base, 5-second delay, Conveyor, Seal-in, Safety warning, Buzzer"));
ch.push(empty());

ch.push(qHdr("M3-Q3/Q7", "Illustrate up and down counter in PLC program with example of applications.", "3", "10", "VERY IMPORTANT", "QP1, QP2", "2"));
ch.push(simpleBox("Counter counts events. CTU = Count Up (each trigger +1). CTD = Count Down (each trigger -1). Done bit (DN) fires when target reached. Reset button clears count. Applications: part counting, inventory management, batch production."));
ch.push(h4("Counter Parameters:"));
ch.push(cod("Counter Number : C5:0  (Counter file 5, element 0)"));
ch.push(cod("Preset (PRE)   : target count value"));
ch.push(cod("Accumulated    : current count"));
ch.push(cod("DN (Done) bit  : ON when Acc >= Preset (CTU) or Acc <= 0 (CTD)"));
ch.push(h4("1. Count Up Counter (CTU) — Parts Counter Application:"));
ch.push(drawNote());
ch.push(cod("RUNG 1: Count each part detected by sensor"));
ch.push(cod("L1 ---[SENSOR]---[C5:0            ]--- L2"));
ch.push(cod("                  CTU (Count Up)"));
ch.push(cod("                  Counter : C5:0"));
ch.push(cod("                  Preset  : 100"));
ch.push(cod("                  Accum   : 0"));
ch.push(cod("  (Each 0→1 transition of SENSOR: Accum = Accum + 1)"));
ch.push(cod(""));
ch.push(cod("RUNG 2: Alarm when 100 parts counted (Acc >= Preset → DN=1)"));
ch.push(cod("L1 ---[C5:0/DN]---( ALARM )--- L2"));
ch.push(cod(""));
ch.push(cod("RUNG 3: Reset counter (clears Acc to 0, clears DN bit)"));
ch.push(cod("L1 ---[RESET_BTN]---[C5:0 RES]--- L2"));
ch.push(h4("CTU Application Examples:"));
ch.push(blt("Count boxes filled on packaging line → stop conveyor after 100 boxes"));
ch.push(blt("Count machine cycles → trigger maintenance after 10,000 cycles"));
ch.push(blt("Count bottles filled → signal end of batch to operator"));
ch.push(h4("2. Count Down Counter (CTD) — Inventory Application:"));
ch.push(drawNote());
ch.push(cod("RUNG 1: Count down each item dispensed"));
ch.push(cod("L1 ---[DISPENSE]---[C5:1            ]--- L2"));
ch.push(cod("                    CTD (Count Down)"));
ch.push(cod("                    Counter : C5:1"));
ch.push(cod("                    Preset  : 50  (start count at 50)"));
ch.push(cod("                    Accum   : 50  (initially loaded at preset)"));
ch.push(cod("  (Each DISPENSE pulse: Accum = Accum - 1)"));
ch.push(cod(""));
ch.push(cod("RUNG 2: Low stock warning (compare Acc ≤ 5)"));
ch.push(cod("L1 ---[LEQ: C5:1/ACC, 5]---( LOW_STOCK )--- L2"));
ch.push(cod(""));
ch.push(cod("RUNG 3: Empty alarm when count reaches 0 (DN bit)"));
ch.push(cod("L1 ---[C5:1/DN]---( EMPTY_ALARM )--- L2"));
ch.push(h4("CTD Application Examples:"));
ch.push(blt("Inventory management — count parts remaining in a hopper"));
ch.push(blt("Dispensing machine — count doses remaining"));
ch.push(blt("Controlled process — allow exactly N items then stop"));
ch.push(h4("Up-Down Counter (Combined for Part Zone Monitoring):"));
ch.push(drawNote());
ch.push(cod("RUNG 1: Count parts ENTERING machine (Count Up)"));
ch.push(cod("L1 ---[IN_SENSOR]---[C5:2 CTU Pre=50]--- L2"));
ch.push(cod(""));
ch.push(cod("RUNG 2: Count parts LEAVING machine (Count Down)"));
ch.push(cod("L1 ---[OUT_SENSOR]---[C5:2 CTD Pre=50]--- L2"));
ch.push(cod("  (Both CTU and CTD reference same counter C5:2)"));
ch.push(cod("  Acc = parts in machine = parts IN - parts OUT"));
ch.push(cod(""));
ch.push(cod("RUNG 3: Alarm when machine full (50 parts)"));
ch.push(cod("L1 ---[C5:2/DN]---( FULL_ALARM )--- L2"));
ch.push(keyBox("CTU, CTD, RES, Preset, Accumulated, Done bit (DN), Count Up, Count Down, Reset, Batch counting, Inventory, Parts counter, C5:0, C5:0/DN, CU bit, CD bit, OV bit, UN bit"));
ch.push(empty());

ch.push(qHdr("M3-Q4", "Write a PLC program using timer for ON/OFF control in temperature regulation system.", "3", "10", "VERY IMPORTANT", "QP2", "1"));
ch.push(simpleBox("Heater turns ON when temperature is low. A TON timer prevents it from staying ON too long (max cycle protection). After the set time, heater turns OFF. Another timer creates a cooling period before heater can restart. This is ON/OFF (bang-bang) control."));
ch.push(h4("I/O Assignment:"));
ch.push(mkTable(["I/O", "Device", "Address"], [["INPUT", "TEMP_LOW — temperature below setpoint", "I:0/0"], ["INPUT", "TEMP_HIGH — temperature above setpoint", "I:0/1"], ["OUTPUT", "HEATER — heating element contactor", "O:0/0"], ["OUTPUT", "HEATER_LIGHT — indicator lamp", "O:0/1"], ["TIMER", "T4:0 — Heater ON timer (max ON time)", "T4:0"], ["TIMER", "T4:1 — Cooling period timer", "T4:1"]], [2500, 3500, 3360]));
ch.push(h4("Ladder Diagram — Timer-Based Temperature ON/OFF Control:"));
ch.push(drawNote());
ch.push(cod("RUNG 1: Turn ON heater when temp LOW and cooling period done"));
ch.push(cod("L1 ---[TEMP_LOW]---[/TEMP_HIGH]---[/T4:1/EN]---( HEATER )--- L2"));
ch.push(cod("  TEMP_LOW:    ON when below setpoint"));
ch.push(cod("  /TEMP_HIGH:  NC — breaks if temp goes high (safety)"));
ch.push(cod("  /T4:1/EN:    NC — prevents restart during cooling period"));
ch.push(cod(""));
ch.push(cod("RUNG 2: Max ON-time safety timer (heater cannot stay ON forever)"));
ch.push(cod("L1 ---[HEATER]---[TON: T4:0, Pre=50, TB=1.0s]--- L2"));
ch.push(cod("  If heater stays ON 50 seconds, DN bit fires"));
ch.push(cod(""));
ch.push(cod("RUNG 3: Force heater OFF when max time reached"));
ch.push(cod("L1 ---[T4:0/DN]---( U-HEATER )--- L2  (Unlatch heater coil)"));
ch.push(cod("  OR if using standard coil: T4:0/DN in Rung 1 breaks circuit"));
ch.push(cod(""));
ch.push(cod("RUNG 4: Start cooling timer when heater goes OFF"));
ch.push(cod("L1 ---[/HEATER]---[TEMP_HIGH]---[TON: T4:1, Pre=30, TB=1.0s]--- L2"));
ch.push(cod("  Cooling timer prevents rapid cycling — 30 second minimum off-time"));
ch.push(cod(""));
ch.push(cod("RUNG 5: Heater indicator lamp"));
ch.push(cod("L1 ---[HEATER]---( HEATER_LIGHT )--- L2"));
ch.push(h4("Operation:"));
ch.push(blt("Temperature drops below setpoint: TEMP_LOW activates → HEATER turns ON → T4:0 starts"));
ch.push(blt("HEATER_LIGHT turns ON (Rung 5)"));
ch.push(blt("Temperature rises to setpoint: TEMP_HIGH activates → /TEMP_HIGH in Rung 1 breaks → HEATER turns OFF"));
ch.push(blt("T4:1 (cooling timer) starts preventing immediate restart"));
ch.push(blt("After cooling period: T4:1 resets → system ready to respond to TEMP_LOW again"));
ch.push(keyBox("TON timer, ON/OFF control, Bang-bang control, TEMP_LOW, TEMP_HIGH, Heater ON timer, Cooling period, Temperature setpoint, Duty cycle, Timer EN bit, Timer DN bit"));
ch.push(empty());

ch.push(qHdr("M3-Q6", "Explain Timer on Delay and Timer off Delay in PLC.", "3", "8", "VERY IMPORTANT", "QP1", "1"));
ch.push(simpleBox("TON: Input ON → wait → output ON (delays the ON). TOF: Input ON → output immediately ON; Input OFF → wait → output OFF (delays the OFF). Easy memory: TON delays when it turns ON, TOF delays when it turns OFF."));
ch.push(h4("1. TON — Timer On-Delay:"));
ch.push(para("Output turns ON after the input has been continuously TRUE for the preset time. If input goes FALSE before preset, timer resets to zero."));
ch.push(h4("TON Ladder Diagram:"));
ch.push(drawNote());
ch.push(cod("RUNG 1: Enable timer when condition is TRUE"));
ch.push(cod("L1 ---[COND]---[TON: T4:0, Pre=10, TB=1.0s]--- L2"));
ch.push(cod("  Total delay = 10 × 1.0s = 10 seconds"));
ch.push(cod(""));
ch.push(cod("RUNG 2: Output after 10s delay (DN bit)"));
ch.push(cod("L1 ---[T4:0/DN]---( OUTPUT )--- L2"));
ch.push(h4("TON Timing Diagram:"));
ch.push(cod("Input:    _____|_______________|______"));
ch.push(cod("              ON (input TRUE)         "));
ch.push(cod("Timer:         |---10s delay---|"));
ch.push(cod("DN bit:                        |______|"));
ch.push(cod("Output:                        |______| (ON only after 10s)"));
ch.push(cod("If input FALSE before 10s: timer resets to 0, output stays OFF"));
ch.push(h4("TON Applications:"));
ch.push(blt("Conveyor start delay — 5 second warning before belt starts"));
ch.push(blt("Motor startup delay — allow cooling fluid to circulate first"));
ch.push(blt("Process delay — wait for pressure to build before opening valve"));
ch.push(h4("2. TOF — Timer Off-Delay:"));
ch.push(para("Output turns ON immediately when input goes TRUE. Output turns OFF after the preset time following the input going FALSE."));
ch.push(h4("TOF Ladder Diagram:"));
ch.push(drawNote());
ch.push(cod("RUNG 1: TOF timer"));
ch.push(cod("L1 ---[COND]---[TOF: T4:1, Pre=5, TB=1.0s]--- L2"));
ch.push(cod(""));
ch.push(cod("RUNG 2: Output follows timer DN bit (opposite of TON)"));
ch.push(cod("L1 ---[T4:1/DN]---( OUTPUT )--- L2"));
ch.push(cod("Note: TOF/DN=1 when timer is NOT timing (output stays ON while DN=1)"));
ch.push(h4("TOF Timing Diagram:"));
ch.push(cod("Input:    _____|___________|_____"));
ch.push(cod("               ON          OFF   "));
ch.push(cod("Output:        |immediately|_____|  (ON immediately; OFF after 5s)"));
ch.push(cod("                           |5s→OFF"));
ch.push(h4("TOF Applications:"));
ch.push(blt("Fan keeps running 5 minutes after oven turns off (cool-down)"));
ch.push(blt("Conveyor continues 10s after production stops (clear belt)"));
ch.push(blt("Motor cooling fan stays on 2 minutes after motor stops"));
ch.push(keyBox("TON, TOF, RTO, Preset, Accumulated, Done bit (DN), Enable bit (EN), Time base, On-delay, Off-delay, Retentive timer, T4:0, Timing diagram, Total time = Preset × Time Base"));
ch.push(empty());

ch.push(qHdr("M3-Q8", "Explain PLC sequencer instruction.", "3", "10", "IMPORTANT", "QP1", "1"));
ch.push(simpleBox("A sequencer steps through a series of predefined output patterns, one step at a time — like a music box. Instead of dozens of rungs for each step, you define patterns in a data file and the sequencer cycles through automatically."));
ch.push(h4("What is a Sequencer?"));
ch.push(para("A sequencer instruction cycles through predefined output patterns stored in a sequencer data file. At each step, the sequencer sets outputs to match the pattern in that step's data word. Advances to next step based on a trigger (timer pulse or sensor signal)."));
ch.push(h4("Allen-Bradley Sequencer Instructions:"));
ch.push(mkTable(["Instruction", "Full Name", "Function"], [["SQO", "Sequencer Output", "Reads bit patterns from file and writes to output at each step"], ["SQI", "Sequencer Input", "Compares input to reference data, sets found bit when match"], ["SQC", "Sequencer Compare", "Compares input data to sequencer file"], ["SQL", "Sequencer Load", "Loads input register into sequencer file"], ["BSL", "Bit Shift Left", "Shifts bits left one position each trigger"], ["BSR", "Bit Shift Right", "Shifts bits right one position each trigger"], ["FFL", "FIFO Load", "Loads data into FIFO queue"], ["FFU", "FIFO Unload", "Unloads data from FIFO queue"]], [1500, 2000, 5860]));
ch.push(h4("SQO Instruction Parameters:"));
ch.push(cod("SQO (Sequencer Output):"));
ch.push(cod("  File    : #N7:0   (sequencer data file starting address)"));
ch.push(cod("  Mask    : 00FF    (which bits are active — 1=active, 0=masked)"));
ch.push(cod("  Dest    : O:2.0   (output register to write to each step)"));
ch.push(cod("  Control : R6:0    (length, position, status bits)"));
ch.push(cod("  Length  : 4       (number of steps in sequence)"));
ch.push(cod("  Position: 0       (current step pointer, starts at 0)"));
ch.push(h4("Traffic Light Example:"));
ch.push(cod("Step 0: N7:0 = 0000 0001 → Red ON    (R=1, Y=0, G=0)"));
ch.push(cod("Step 1: N7:1 = 0000 0100 → Yellow ON (R=0, Y=1, G=0)"));
ch.push(cod("Step 2: N7:2 = 0000 0010 → Green ON  (R=0, Y=0, G=1)"));
ch.push(cod("Step 3: N7:3 = 0000 0001 → Red ON    (cycle repeats)"));
ch.push(h4("Ladder Diagram:"));
ch.push(drawNote());
ch.push(cod("RUNG 1: Timer advances sequencer every 10 seconds"));
ch.push(cod("L1 ---[T4:0/DN]---[TON: T4:0, Pre=10, TB=1s]--- L2"));
ch.push(cod(""));
ch.push(cod("RUNG 2: Sequencer output activated by timer DN pulse"));
ch.push(cod("L1 ---[T4:0/DN]---[SQO: File=#N7:0, Mask=00FF,"));
ch.push(cod("                        Dest=O:2.0, Length=4, Control=R6:0]--- L2"));
ch.push(h4("Applications:"));
ch.push(blt("Traffic lights — cycle through Red, Yellow, Green patterns"));
ch.push(blt("Automated assembly lines — sequence of machine operations"));
ch.push(blt("Robotic arm movements — step through programmed positions"));
ch.push(blt("Car wash sequence — soap, rinse, dry in order"));
ch.push(keyBox("SQO, SQI, SQC, SQL, BSL, BSR, FFL, FFU, Sequencer file, Mask, Destination, Control file, Step, Position, Length, Traffic light, Assembly sequence"));
ch.push(empty());

ch.push(qHdr("M3-Q10", "Design automation solution for temperature conversion logic in PLCs using mathematical operations.", "3", "10", "VERY IMPORTANT", "IAT", "1"));
ch.push(simpleBox("Converts Celsius to Fahrenheit using F=(9×C/5)+32. Input from thumbwheel (BCD) → FRD converts to binary → MUL×9 → DIV÷5 → ADD+32 → TOD converts to BCD → display on LED."));
ch.push(colorBox("Formula: F = (9 × C / 5) + 32", KEY_BG, "5B3000", true));
ch.push(h4("Numerical Example (C=60):"));
ch.push(cod("Step 1: 9 × 60 = 540   (MUL)"));
ch.push(cod("Step 2: 540 / 5 = 108  (DIV)"));
ch.push(cod("Step 3: 108 + 32 = 140 (ADD)"));
ch.push(cod("Answer: 60°C = 140°F ✓"));
ch.push(h4("I/O Assignment:"));
ch.push(mkTable(["I/O", "Device", "Address"], [["INPUT", "Thumbwheel switch (Celsius in BCD)", "I:012"], ["INTERNAL", "N7:0 = Celsius (binary)", "N7:0"], ["INTERNAL", "N7:1 = ×9 result", "N7:1"], ["INTERNAL", "N7:2 = ÷5 result", "N7:2"], ["INTERNAL", "N7:3 = Final °F", "N7:3"], ["OUTPUT", "LED display (Fahrenheit in BCD)", "O:013"]], [2000, 3500, 3860]));
ch.push(h4("5-Rung Ladder Diagram:"));
ch.push(drawNote());
ch.push(cod("RUNG 1: Convert BCD input to binary (FRD = From BCD)"));
ch.push(cod("L1 ---[ALWAYS_ON]---[FRD: Source=I:012, Dest=N7:0]--- L2"));
ch.push(cod("  BCD input 060 → N7:0 = 60 decimal"));
ch.push(cod(""));
ch.push(cod("RUNG 2: Multiply Celsius by 9"));
ch.push(cod("L1 ---[ALWAYS_ON]---[MUL: SA=N7:0(60), SB=9, Dest=N7:1(540)]--- L2"));
ch.push(cod(""));
ch.push(cod("RUNG 3: Divide by 5"));
ch.push(cod("L1 ---[ALWAYS_ON]---[DIV: SA=N7:1(540), SB=5, Dest=N7:2(108)]--- L2"));
ch.push(cod(""));
ch.push(cod("RUNG 4: Add 32 → Final Fahrenheit result"));
ch.push(cod("L1 ---[ALWAYS_ON]---[ADD: SA=N7:2(108), SB=32, Dest=N7:3(140)]--- L2"));
ch.push(cod(""));
ch.push(cod("RUNG 5: Convert binary to BCD for LED display (TOD = To BCD)"));
ch.push(cod("L1 ---[ALWAYS_ON]---[TOD: Source=N7:3(140), Dest=O:013]--- L2"));
ch.push(h4("Verification:"));
ch.push(cod("  0°C  → F = (9×0/5)+32  = 32°F   (freezing point) ✓"));
ch.push(cod("  100°C→ F = (9×100/5)+32 = 212°F  (boiling point)  ✓"));
ch.push(cod("  60°C → F = (9×60/5)+32  = 140°F  (hot water)      ✓"));
ch.push(keyBox("F=(9C/5)+32, Temperature conversion, MUL, DIV, ADD, FRD (From BCD), TOD (To BCD), Thumbwheel switch, LED display, N7 registers, BCD conversion, Celsius, Fahrenheit"));
ch.push(empty());

ch.push(qHdr("M3-Q11", "Demonstrate application of subtraction instruction to detect vessel overfill conditions.", "3", "10", "VERY IMPORTANT", "IAT", "1"));
ch.push(simpleBox("Vessel fills with liquid measured by weight sensor. GEQ detects when weight ≥ 500 lbs (full). SUB calculates how much OVER 500 lbs the vessel is. If overfill > 5 lbs, alarm sounds. Classic 5-rung program."));
ch.push(h4("System Description:"));
ch.push(para("A vessel (tank) fills with liquid. A weight transducer connected to analog input I012 measures weight. Fill solenoid opens to fill. When weight reaches 500 lbs, filling stops. If weight exceeds 505 lbs (5 lbs tolerance), alarm activates."));
ch.push(h4("5-Rung Ladder Diagram — Vessel Overfill:"));
ch.push(drawNote());
ch.push(cod("RUNG 1: Start filling — open fill solenoid when START pressed"));
ch.push(cod("L1 --[/STOP]--[START]--+--( FIL_SOL )-- L2"));
ch.push(cod("                        |"));
ch.push(cod("       ---[FIL_SOL]----+  (seal-in)"));
ch.push(cod(""));
ch.push(cod("RUNG 2: Fill solenoid auxiliary / filling indicator"));
ch.push(cod("L1 ---[FIL_SOL]---[Full]---( )--- L2  (filling indicator)"));
ch.push(cod(""));
ch.push(cod("RUNG 3: Stop filling when weight >= 500 lbs (GEQ comparison)"));
ch.push(cod("L1 ---[GEQ              ]---( FULL )--- L2"));
ch.push(cod("       GREATER THAN OR EQUAL"));
ch.push(cod("       Source A  I012  (current weight reading)"));
ch.push(cod("       Source B  500   (preset = 500 lbs)"));
ch.push(cod("  When weight >= 500: GEQ TRUE → FULL bit sets → breaks Rung 1 seal-in"));
ch.push(cod(""));
ch.push(cod("RUNG 4: Calculate overfill amount using SUB"));
ch.push(cod("L1 ---[FULL]---[SUB            ]--- L2"));
ch.push(cod("               SUBTRACT"));
ch.push(cod("               Source A  I012  (current weight)"));
ch.push(cod("               Source B  500   (normal full weight)"));
ch.push(cod("               Dest      N71   (overfill amount)"));
ch.push(cod("  Example: weight=508 → N71 = 508-500 = 8 lbs overfill"));
ch.push(cod(""));
ch.push(cod("RUNG 5: Alarm if overfill exceeds 5 lbs tolerance"));
ch.push(cod("L1 ---[GEQ              ]---( ALARM )--- L2"));
ch.push(cod("       GREATER THAN OR EQUAL"));
ch.push(cod("       Source A  N71  (overfill amount)"));
ch.push(cod("       Source B  5    (alarm threshold)"));
ch.push(cod("  If N71 >= 5 lbs: ALARM energizes → audible/visual alert"));
ch.push(h4("Operation Sequence:"));
ch.push(blt("Press START: Fill solenoid opens, vessel begins filling"));
ch.push(blt("Weight sensor continuously sends weight to I012 (analog)"));
ch.push(blt("Rung 3: When weight >= 500 lbs, GEQ true, FULL bit sets, solenoid stops"));
ch.push(blt("Rung 4: SUB calculates how much over 500 lbs: N71 = I012 - 500"));
ch.push(blt("Rung 5: If N71 >= 5 (overfill > 5 lbs), ALARM activates"));
ch.push(keyBox("SUB instruction, GEQ (Greater Than or Equal), Overfill, Weight transducer, Fill solenoid, FULL bit, Alarm, N71, I012, 500 lbs threshold, 5 lbs tolerance, Vessel, Analog input"));
ch.push(empty());

ch.push(qHdr("M3-Q12", "Sketch and explain PLC logic circuits for arithmetic operations ADD, MUL.", "3", "10", "IMPORTANT", "IAT", "1"));
ch.push(simpleBox("ADD adds two source values, stores result in destination. MUL multiplies. The ladder shows a switch enabling the math block. An EQU compare block can verify the result."));
ch.push(h4("ADD (Addition) PLC Logic Circuit:"));
ch.push(drawNote());
ch.push(cod("Inputs:                Ladder Logic Program:         "));
ch.push(cod("                       ┌─────────────┐              "));
ch.push(cod("  SW ──┤├──────────────│ADD          │              "));
ch.push(cod(" (NO)                  │ADD          │              "));
ch.push(cod("                       │Source A N7:0│ = 25         "));
ch.push(cod("  Hand                 │Source B N7:1│ = 50         "));
ch.push(cod("  sensor               │Destination  │              "));
ch.push(cod("                       │         N7:2│ = 75  ← result"));
ch.push(cod("                       └─────────────┘              "));
ch.push(cod("Figure: SLC 500 ADD instruction (Figure 11-4)        "));
ch.push(cod("When SW closed: N7:2 = N7:0 + N7:1 = 25 + 50 = 75  "));
ch.push(cod("When SW open: ADD does not execute, N7:2 holds value "));
ch.push(h4("ADD Applications:"));
ch.push(para("Calculating total distance traveled: ADD current position to previous total. Totaling batch weights: ADD each batch weight to a running total register."));
ch.push(h4("MUL (Multiplication) PLC Logic Circuit:"));
ch.push(drawNote());
ch.push(cod("Inputs:                Ladder Logic Program:         Output:"));
ch.push(cod("                       ┌─────────────────┐          "));
ch.push(cod("  SW ──┤├──────────────│MUL              │──( PL1 )─"));
ch.push(cod(" (NO)                  │MULTIPLY         │ (pilot light)"));
ch.push(cod("                       │Source A N7:1 123│          "));
ch.push(cod("  Hand                 │Source B N7:2  60│          "));
ch.push(cod("  sensor               │Dest      N7:3 7503│        "));
ch.push(cod("                       └─────────────────┘          "));
ch.push(cod("                       ┌─────────────────┐          "));
ch.push(cod("                       │EQU              │──( PL1 )─"));
ch.push(cod("                       │Source A N7:3 7503│         "));
ch.push(cod("                       │Source B  7503    │         "));
ch.push(cod("                       └─────────────────┘          "));
ch.push(cod("Figure: MUL instruction (Figure 11-10)               "));
ch.push(cod("When SW closed: N7:3 = N7:1 × N7:2 = 123 × 60 = 7503"));
ch.push(cod("EQU rung: if N7:3 equals 7503, PL1 turns ON (verifies result)"));
ch.push(h4("MUL Applications:"));
ch.push(para("Converting RPM to linear speed: speed = RPM × wheel circumference. Calculating power: P = V × I (volts × current). Scaling analog inputs: real_value = raw_count × scale_factor."));
ch.push(keyBox("ADD, MUL, Source A, Source B, Destination, N7 file, Integer, SLC 500, EQU compare, Pilot light, Scale factor, Arithmetic instruction"));
ch.push(empty());

ch.push(h2("3.4 Quick Revision — Module 3"));
ch.push(colorBox("Math: ADD(+), SUB(-), MUL(×), DIV(÷), SQR(√), NEG, CPT — each has Source A, Source B, Destination\nTON: delays the ON | TOF: delays the OFF | Total Time = Preset × Time Base\nCTU: counts UP each 0→1 | CTD: counts DOWN | RES: resets | DN fires when Acc>=Preset\nTemp: F=(9C/5)+32 — uses FRD→MUL→DIV→ADD→TOD\nVessel overfill: GEQ detects full (>=500), SUB calculates overfill, GEQ triggers alarm (>=5)\nSequencer: SQO steps through output patterns stored in data file", SUCCESS_BG));
ch.push(h2("3.5 Memory Tricks — Module 3"));
ch.push(colorBox("Math: 'ADD SUB MUL DIV — All Students Must Drive'\nTON vs TOF: 'TON delays the ON | TOF delays the OFF'\nCTU vs CTD: 'CTU goes UP | CTD goes DOWN'\nTemp formula: '9 times C over 5 plus 32 equals F'\nSequencer = 'Music box — steps through patterns automatically'", KEY_BG));
ch.push(pgBreak());

// ============ MODULE 4 ============
ch.push(h1("MODULE 4: Data Handling Functions & Shift Registers"));
ch.push(h2("4.1 Theory Notes"));
ch.push(h3("SKIP vs MCR"));
ch.push(mkTable(["Feature", "SKIP Function", "MCR Function"], [["Active when", "SK coil is ON", "MCR coil is OFF"], ["Effect on zone", "Lines FROZEN in LAST STATE", "All outputs FORCED TO OFF"], ["Fail-safe", "NOT fail-safe", "FAIL-SAFE — outputs go OFF"], ["Use case", "Bypass sections conditionally", "Emergency stop, safety zones"]], [2500, 3430, 3430]));
ch.push(empty());
ch.push(h3("MOVE and Block MOVE"));
ch.push(para("MOVE: Copies data from source to destination. Source unchanged. Destination loses old value. Used for dynamic preset changes, recipe management, data transfer. MVM (Masked Move): copies only selected bits using a mask word."));
ch.push(empty());
ch.push(h3("FIFO vs LIFO"));
ch.push(mkTable(["Feature", "FIFO", "LIFO"], [["Full Name", "First In First Out", "Last In First Out"], ["Order", "First loaded = first retrieved", "Last loaded = first retrieved"], ["Analogy", "Queue (bank line)", "Stack (pile of plates)"], ["PLC Instructions", "FFL (load), FFU (unload)", "LFU (load/unload)"], ["Application", "Batch tracking, recipe management", "Alarm stacks, reverse processing"]], [2000, 3680, 3680]));
ch.push(empty());

ch.push(h2("4.2 All Questions — Module 4"));
[["M4-Q1", "Explain the operation of the MOVE function and its applications in data handling.", "4", "10", "VERY IMPORTANT", "QP1, QP2", "2"],
["M4-Q2", "Discuss the role of Master Control Relay in PLC program and provide a sample implementation.", "4", "10", "VERY IMPORTANT", "QP2", "1"],
["M4-Q3", "Discuss the operation of FIFO and LIFO function in automation.", "4", "10", "VERY IMPORTANT", "QP1, QP2", "2"],
["M4-Q4", "What are shift registers? Explain their operations and applications in PLC systems.", "4", "10", "VERY IMPORTANT", "QP1, QP2", "2"],
["M4-Q5", "Explain master control relay with an example of MCT instruction.", "4", "12", "IMPORTANT", "QP1", "1"],
["M4-Q6", "Explain MOVE instructions in PLC data handling.", "4", "8", "VERY IMPORTANT", "QP1", "1"],
["M4-Q7", "Explain shift register with an example of 8-bit shift register.", "4", "10", "IMPORTANT", "QP1", "1"],
["M4-Q8", "What are the advantages and disadvantages of FIFO and LIFO?", "4", "10", "IMPORTANT", "QP1", "1"],
].forEach(q => ch.push(qHdr(q[0], q[1], q[2], q[3], q[4], q[5], q[6])));
ch.push(empty());

ch.push(h2("4.3 Complete Answers — Module 4"));

ch.push(qHdr("M4-Q1/Q6", "Explain the operation of the MOVE function and its applications in data handling.", "4", "10", "VERY IMPORTANT", "QP1, QP2", "2"));
ch.push(simpleBox("MOVE = copy-paste for PLC registers. Copy data from Source to Destination. Source is UNCHANGED (survives). Destination LOSES its old value (overwritten). Key rule: Source Survives, Destination Dies."));
ch.push(h4("MOVE Operation:"));
ch.push(cod("MOVE instruction:"));
ch.push(cod("  Source:      N7:5  (contains value 50) ← UNCHANGED after MOVE"));
ch.push(cod("  Destination: N7:6  (had value 30)      ← OLD VALUE LOST, now = 50"));
ch.push(cod("  After MOVE:  N7:5 = 50 (unchanged), N7:6 = 50 (new value)"));
ch.push(h4("MOVE Ladder Diagram — Dynamic Timer Preset Example:"));
ch.push(drawNote());
ch.push(cod("RUNG 1: Short cycle mode (SW_007 selects 7-second timer)"));
ch.push(cod("L1 ---[SW_007]---[MOVE: Source=7, Dest=T4:0/PRE]--- L2"));
ch.push(cod("  When SW_007 closes: timer preset changes to 7 seconds"));
ch.push(cod(""));
ch.push(cod("RUNG 2: Long cycle mode (SW_009 selects 15-second timer)"));
ch.push(cod("L1 ---[SW_009]---[MOVE: Source=15, Dest=T4:0/PRE]--- L2"));
ch.push(cod("  When SW_009 closes: timer preset changes to 15 seconds"));
ch.push(cod(""));
ch.push(cod("RUNG 3: Timer uses dynamically-set preset value"));
ch.push(cod("L1 ---[START]---[TON: T4:0, Pre=T4:0/PRE]--- L2"));
ch.push(h4("Applications of MOVE:"));
ch.push(blt("Dynamic Timer Preset: Change timer preset value based on operator selection"));
ch.push(blt("Setpoint Adjustment: Write new process setpoint from HMI to comparison register"));
ch.push(blt("Data Transfer: Copy sensor reading from input register to calculation register"));
ch.push(blt("Recipe Management: Load different process parameters for different products"));
ch.push(blt("Initialization: Set registers to known starting values at power-up"));
ch.push(blt("Counter Preset Change: Change counter preset value on the fly based on batch size"));
ch.push(h4("Masked MOVE (MVM):"));
ch.push(cod("MVM (Masked Move):"));
ch.push(cod("  Source  : N7:5  (0000 1111 1111 0000 in binary)"));
ch.push(cod("  Mask    : 0000 1111 0000 0000 (1=copy this bit, 0=leave unchanged)"));
ch.push(cod("  Dest    : N7:6  (only masked bits are transferred; others unchanged)"));
ch.push(cod("  Use: Transfer specific bits without affecting other bits in destination"));
ch.push(keyBox("MOVE, MVM (Masked Move), Source, Destination, Dynamic preset, Recipe management, Data transfer, Initialization, Source unchanged, Destination overwritten, N7 file"));
ch.push(empty());

ch.push(qHdr("M4-Q2/Q5", "Discuss the role of Master Control Relay / Explain MCR with MCT instruction.", "4", "10+12", "VERY IMPORTANT", "QP1, QP2", "2"));
ch.push(simpleBox("MCR = Master Control Relay = zone master switch. When MCR condition goes FALSE, ALL non-retentive outputs in the zone go OFF automatically. MCT marks the end of the zone. Difference from SKIP: SKIP leaves outputs in LAST STATE; MCR forces them OFF."));
ch.push(h4("What is MCR?"));
ch.push(para("MCR (Master Control Relay) is a PLC program instruction that creates a controlled zone within the ladder program. When the MCR instruction is energized (TRUE), all rungs within the MCR zone execute normally. When MCR goes FALSE (de-energized), all non-retentive outputs in the zone are FORCED TO OFF immediately, regardless of individual rung logic."));
ch.push(h4("MCR vs SKIP Comparison:"));
ch.push(mkTable(["Feature", "MCR", "SKIP"], [["When inactive", "ALL outputs forced OFF (de-energized)", "Outputs RETAIN their last state"], ["Safety", "Fail-safe — OFF is the safe state", "NOT fail-safe"], ["Use case", "Emergency stop, safety circuits", "Bypass sections when not needed"], ["Output state", "Cleared to 0 (OFF)", "Frozen at last value"], [], []], [2500, 3430, 3430]));
ch.push(h4("MCR Structure and MCT Instruction:"));
ch.push(drawNote());
ch.push(cod("L1 ---[MASTER_ENABLE]---[MCR]--- L2    ← MCR start rung"));
ch.push(cod("  │  MCR ZONE BEGINS HERE:             │"));
ch.push(cod("  │  Rung A: L1 ---[COND_A]---( OUT1 )---│"));
ch.push(cod("  │  Rung B: L1 ---[COND_B]---( OUT2 )---│"));
ch.push(cod("  │  Rung C: L1 ---[COND_C]---( MTR1 )---│"));
ch.push(cod("  │  MCR ZONE ENDS HERE:               │"));
ch.push(cod("L1 ---[   ]---[MCT]--- L2              ← MCR end (MCT instruction)"));
ch.push(cod(""));
ch.push(cod("MCT = Master Control Reset — marks END of zone; no conditional; always executes"));
ch.push(cod("When MASTER_ENABLE = ON:  MCR zone executes normally"));
ch.push(cod("When MASTER_ENABLE = OFF: OUT1, OUT2, MTR1 all go OFF immediately"));
ch.push(h4("Practical Example — Machine Mode Control:"));
ch.push(drawNote());
ch.push(cod("L1 ---[/SAFETY_DOOR]---[MODE_RUN]---[MCR]--- L2"));
ch.push(cod("  (Safety door NC: closed=passes | MODE_RUN must be ON)"));
ch.push(cod(""));
ch.push(cod("  MCR ZONE:"));
ch.push(cod("  L1 ---[START_BTN]---( SPINDLE_MOTOR )--- L2"));
ch.push(cod("  L1 ---[FEED_EN]---( FEED_MOTOR )--- L2"));
ch.push(cod("  L1 ---[COOLANT_EN]---( COOLANT_PUMP )--- L2"));
ch.push(cod(""));
ch.push(cod("L1 ---[   ]---[MCT]--- L2   ← zone ends here"));
ch.push(cod(""));
ch.push(cod("If safety door OPENS: SAFETY_DOOR=1 → /SAFETY_DOOR=0 → MCR FALSE"));
ch.push(cod("→ ALL motors in zone IMMEDIATELY de-energize (fail-safe)"));
ch.push(h4("Important Rules:"));
ch.push(blt("MCR/MCT pairs CANNOT overlap or be nested"));
ch.push(blt("Retentive outputs (Latch coils) inside MCR zone are NOT turned off when MCR goes FALSE"));
ch.push(blt("Timer and counter accumulated values are NOT reset by MCR going FALSE"));
ch.push(blt("Use MCR for sections where all outputs must go OFF together in an emergency"));
ch.push(keyBox("MCR, MCT, Master Control Relay, Zone, Fail-safe, Non-retentive output, SKIP vs MCR, Safety door, Emergency stop, Machine mode, De-energize, Master Control Reset"));
ch.push(empty());

ch.push(qHdr("M4-Q3/Q8", "Discuss FIFO and LIFO operation in automation. Advantages and disadvantages.", "4", "10", "VERY IMPORTANT", "QP1, QP2", "2"));
ch.push(simpleBox("FIFO = Queue (bank line: first person in is first served). LIFO = Stack (pile of plates: last plate placed is first taken off). Both store and retrieve data in specific order in PLC memory."));
ch.push(h4("FIFO — First In First Out:"));
ch.push(para("FIFO is a data storage method where the first data word loaded is the first word retrieved — like a queue. Data enters one end, exits the other."));
ch.push(cod("FFL (FIFO Load) Parameters:"));
ch.push(cod("  Source      : N7:5   (register to load into FIFO)"));
ch.push(cod("  FIFO        : #N7:20 (FIFO data file start address)"));
ch.push(cod("  Control     : R6:0   (length, position, status bits)"));
ch.push(cod("  Length      : 8      (FIFO can hold 8 words)"));
ch.push(cod(""));
ch.push(cod("FFU (FIFO Unload):"));
ch.push(cod("  FIFO        : #N7:20 (same FIFO data file)"));
ch.push(cod("  Destination : N7:30  (where retrieved data goes)"));
ch.push(cod("  Control     : R6:0   (same control file)"));
ch.push(h4("FIFO Example:"));
ch.push(cod("Load (in order): Color1=Red(1) → Color2=Blue(2) → Color3=Green(3)"));
ch.push(cod("FIFO stack: [1, 2, 3]"));
ch.push(cod("Unload (same order — FIRST IN, FIRST OUT):"));
ch.push(cod("  Unload1 → gets 1 (Red)   ← loaded first, retrieved first"));
ch.push(cod("  Unload2 → gets 2 (Blue)"));
ch.push(cod("  Unload3 → gets 3 (Green)"));
ch.push(h4("LIFO — Last In First Out:"));
ch.push(para("LIFO is a data storage method where the LAST data word loaded is the FIRST word retrieved — like a stack of plates."));
ch.push(cod("Load (in order): Step_A → Step_B → Step_C"));
ch.push(cod("LIFO stack: [A (bottom), B, C (top)]"));
ch.push(cod("Unload (REVERSE order — LAST IN, FIRST OUT):"));
ch.push(cod("  Unload1 → gets C (last in, first out)"));
ch.push(cod("  Unload2 → gets B"));
ch.push(cod("  Unload3 → gets A"));
ch.push(h4("Advantages and Disadvantages:"));
ch.push(mkTable(["Aspect", "FIFO", "LIFO"], [
    ["Order", "First in = first out", "Last in = first out"],
    ["Analogy", "Queue (bank line)", "Stack of plates"],
    ["Advantage 1", "Preserves order — good for sequential processes", "Fast access to most recent data"],
    ["Advantage 2", "Good for batch/recipe tracking in order", "Good for undo operations, reverse processing"],
    ["Disadvantage 1", "Latest data accessed LAST", "Oldest data buried at bottom"],
    ["Disadvantage 2", "Slower to access recent entry", "Data may be lost if overflow not checked"],
    ["PLC Application", "Batch tracking, event logging, conveyor part tracking", "Alarm acknowledgment stacks, undo operations"],
], [2000, 3680, 3680]));
ch.push(keyBox("FIFO Stack, LIFO Stack, FFL (FIFO Load), FFU (FIFO Unload), Empty bit (EM), Full bit (FL), Control file, Queue analogy, Stack analogy, First in first out, Last in first out"));
ch.push(empty());

ch.push(qHdr("M4-Q4/Q7", "Explain shift registers: operations, applications, and 8-bit example.", "4", "10", "VERY IMPORTANT", "QP1, QP2", "2"));
ch.push(simpleBox("Shift register = row of bits that all slide one position on each pulse. Like a row of 8 light bulbs — each pulse: leftmost gets new signal, each other gets its neighbor's old value. Used for conveyor tracking (which station has a part)."));
ch.push(h4("Shift Register Instructions:"));
ch.push(mkTable(["Instruction", "Function", "New bit entry"], [["BSL (Bit Shift Left)", "Shifts all bits LEFT one position per trigger", "Enters at LSB (right end)"], ["BSR (Bit Shift Right)", "Shifts all bits RIGHT one position per trigger", "Enters at MSB (left end)"]], [3000, 4000, 2360]));
ch.push(h4("BSL Instruction Parameters:"));
ch.push(cod("BSL (Bit Shift Left):"));
ch.push(cod("  File       : #B3:0   (bit register to shift)"));
ch.push(cod("  Control    : R6:0    (length, position, status)"));
ch.push(cod("  Bit Address: B3:0/0  (serial input bit — receives new data)"));
ch.push(cod("  Length     : 8       (number of bits to manage)"));
ch.push(h4("8-Bit Shift Register — Step-by-Step Conveyor Tracking:"));
ch.push(drawNote());
ch.push(cod("Application: 8 stations on conveyor — track which station has a part"));
ch.push(cod("Register B3:0 (8 bits): [B7][B6][B5][B4][B3][B2][B1][B0]"));
ch.push(cod("                                                          ^"));
ch.push(cod("                                     New bit enters here (serial input B3:0/0)"));
ch.push(cod(""));
ch.push(cod("Initial:  B3:0 = 0000 0000  (all stations empty)"));
ch.push(cod(""));
ch.push(cod("Pulse 1: Part detected at entry → new bit = 1"));
ch.push(cod("  Shift LEFT: B3:0 = 0000 0001  (part at Station 1 = Bit0)"));
ch.push(cod(""));
ch.push(cod("Pulse 2: Another part → new bit = 1"));
ch.push(cod("  Shift LEFT: B3:0 = 0000 0011  (parts at Bit0 and Bit1)"));
ch.push(cod(""));
ch.push(cod("Pulse 3: No part → new bit = 0"));
ch.push(cod("  Shift LEFT: B3:0 = 0000 0110  (parts at Bit1, Bit2; Bit0 empty)"));
ch.push(cod(""));
ch.push(cod("Pulse 4: Part → new bit = 1"));
ch.push(cod("  Shift LEFT: B3:0 = 0000 1101"));
ch.push(cod(""));
ch.push(cod("Pulse 5: No part → new bit = 0"));
ch.push(cod("  Shift LEFT: B3:0 = 0001 1010"));
ch.push(cod(""));
ch.push(cod("Pulse 6: Part → new bit = 1"));
ch.push(cod("  Shift LEFT: B3:0 = 0011 0101"));
ch.push(cod(""));
ch.push(cod("Pulse 7: No part → new bit = 0"));
ch.push(cod("  Shift LEFT: B3:0 = 0110 1010"));
ch.push(cod(""));
ch.push(cod("Pulse 8: Part → new bit = 1"));
ch.push(cod("  Shift LEFT: B3:0 = 1101 0101  (8 stations all tracked)"));
ch.push(cod(""));
ch.push(cod("Reading station status:"));
ch.push(cod("  B3:0/0 = 1 → Station 1 HAS a part"));
ch.push(cod("  B3:0/1 = 0 → Station 2 is EMPTY"));
ch.push(cod("  B3:0/7 = 1 → Station 8 HAS a part"));
ch.push(h4("Ladder Diagram for 8-Bit Shift Register:"));
ch.push(drawNote());
ch.push(cod("RUNG 1: Timer generates shift pulse (1 pulse per conveyor step)"));
ch.push(cod("L1 ---[CONV_STEP]---[TON: T4:0, Pre=5, TB=0.1s]--- L2"));
ch.push(cod(""));
ch.push(cod("RUNG 2: Serial input bit — sensor detects part at entry"));
ch.push(cod("L1 ---[PART_SENSOR]---( B3:0/0 )--- L2  (set serial input)"));
ch.push(cod(""));
ch.push(cod("RUNG 3: Shift LEFT on each timer pulse"));
ch.push(cod("L1 ---[T4:0/DN]---[BSL: File=#B3:0, Control=R6:0,"));
ch.push(cod("                        Bit=B3:0/0, Length=8]--- L2"));
ch.push(h4("Applications of Shift Registers:"));
ch.push(blt("Conveyor part tracking — know which workstation along conveyor has a part"));
ch.push(blt("Sequential lighting — create moving arrow or chase light patterns (flashing arrow sign)"));
ch.push(blt("Paint line tracking — know which car body has which color at each station"));
ch.push(blt("Quality control — mark defective parts and reject them at the correct station downstream"));
ch.push(blt("Programmable time delay — use shift register as a delay line"));
ch.push(keyBox("BSL, BSR, Bit Shift Left, Bit Shift Right, Serial input, Shift pulse, B3 file, Control file, Length, Conveyor tracking, Part tracking, 8-bit register, Rotate register"));
ch.push(empty());

ch.push(h2("4.4 Quick Revision — Module 4"));
ch.push(colorBox("SKIP: Skips N rungs; outputs RETAIN last state (not fail-safe)\nMCR: Zone control; all outputs go OFF when MCR FALSE (FAIL-SAFE); MCT marks end\nMOVE: Copies Source→Destination; Source unchanged, Destination overwritten\nFIFO: First In First Out (queue) — FFL=load, FFU=unload\nLIFO: Last In First Out (stack) — last loaded is first retrieved\nShift Register: BSL shifts LEFT, BSR shifts RIGHT; new bit enters one end\n8-bit: B3:0 tracks 8 stations; each conveyor step = one shift", SUCCESS_BG));
ch.push(h2("4.5 Memory Tricks — Module 4"));
ch.push(colorBox("SKIP vs MCR: 'SKIP Stays, MCR Makes OFF'\nFIFO vs LIFO: 'FIFO=Queue (bank line) | LIFO=Stack of plates'\nMOVE: 'Source Survives, Destination Dies'\nShift Register: 'Slide everything one step; new bit enters from side'\nMCR zone: 'MCR = Master Cutoff Relay for the zone'", KEY_BG));
ch.push(pgBreak());

// ============ MODULE 5 ============
ch.push(h1("MODULE 5: Advanced PLC Programming & Maintenance"));
ch.push(h2("5.1 Theory Notes"));
ch.push(h3("PID Control Basics"));
ch.push(para("PID = Proportional + Integral + Derivative. Feedback control algorithm that continuously calculates error (Setpoint - Process Variable) and applies corrections. Used for temperature, pressure, flow, and level control."));
ch.push(cod("PID Formula: Output = Kp×Error + Ki×∫Error dt + Kd×(dError/dt)"));
ch.push(mkTable(["Mode", "Action", "Effect"], [["P (Proportional)", "Kp × Error magnitude", "Fast response but steady-state offset (droop)"], ["I (Integral)", "Ki × Error × time", "Eliminates offset; slower response"], ["D (Derivative)", "Kd × rate of change", "Reduces overshoot; fast correction"], ["PID (Combined)", "All three combined", "Best: no offset, fast, stable"]], [1500, 3000, 4860]));
ch.push(empty());

ch.push(h2("5.2 All Questions — Module 5"));
[["M5-Q1", "Describe PID control and its implementation in control system.", "5", "10", "VERY IMPORTANT", "QP1, QP2", "2"],
["M5-Q2", "Explain the combined application of PLC and SCADA systems in Industry 4.0.", "5", "10", "VERY IMPORTANT", "QP2", "1"],
["M5-Q3", "What is DCS? Explain how it can overcome the redundancy of PLC.", "5", "10", "VERY IMPORTANT", "QP1, QP2", "2"],
["M5-Q4", "Discuss the selection criterion for PLC based on application requirements.", "5", "10", "VERY IMPORTANT", "QP1, QP2", "2"],
["M5-Q5", "Explain steps involved in implementing a PID controller in a PLC.", "5", "12", "VERY IMPORTANT", "QP1", "1"],
["M5-Q6", "Mention the objectives and functions of SCADA.", "5", "8", "IMPORTANT", "QP1", "1"],
["M5-Q7", "Explain the importance of PLC maintenance.", "5", "12", "IMPORTANT", "QP1", "1"],
["M5-Q8", "List the selection criteria for PLC.", "5", "8", "IMPORTANT", "QP1", "1"],
].forEach(q => ch.push(qHdr(q[0], q[1], q[2], q[3], q[4], q[5], q[6])));
ch.push(empty());

ch.push(h2("5.3 Complete Answers — Module 5"));

ch.push(qHdr("M5-Q1/Q5", "Describe PID control and implementation in PLC. Explain PID implementation steps.", "5", "12", "VERY IMPORTANT", "QP1, QP2", "2"));
ch.push(simpleBox("PID = Proportional + Integral + Derivative. Think of driving a car: P=how far from lane (error), I=how long you've been drifting (accumulated error), D=how fast you're drifting (rate). Together they give smooth, accurate control."));
ch.push(h4("PID Control Fundamentals:"));
ch.push(para("PID is a feedback control algorithm that continuously calculates an error value as the difference between a desired setpoint (SP) and the measured process variable (PV). The controller applies a correction output based on three terms: P (Proportional), I (Integral), and D (Derivative)."));
ch.push(h4("PID Formula:"));
ch.push(colorBox("Output = Kp × Error + Ki × ∫Error dt + Kd × (dError/dt)\nWhere: Error = Setpoint - Process Variable", KEY_BG, "5B3000", true));
ch.push(h4("PID Block Diagram:"));
ch.push(drawNote());
ch.push(cod("  Setpoint (SP)         Error      +--------+  CV (Control)"));
ch.push(cod("  ─────────►(+)────────────────►   │ PID    │  ──────────►"));
ch.push(cod("             │-                     │Control │    Process"));
ch.push(cod("             │         ┌───────── P:│ Kp×E   │           │"));
ch.push(cod("             │         │          I:│ Ki×∫E  │           │"));
ch.push(cod("             │         │          D:│ Kd×dE  │           │"));
ch.push(cod("             │         │            +--------+           │"));
ch.push(cod("             │         │                                 │"));
ch.push(cod("             └─────────┘── Feedback (PV = measured) ────┘"));
ch.push(h4("P, I, D Terms:"));
ch.push(para("Proportional (P): Output proportional to current error magnitude. Provides fast response but leaves permanent steady-state offset (droop) because output goes to zero when error = 0."));
ch.push(para("Integral (I): Integrates (accumulates) error over time. Continues producing output until error = 0, thus eliminating the steady-state offset. Called 'reset action'. Acts on size AND time duration of error."));
ch.push(para("Derivative (D): Reacts to the RATE OF CHANGE of error. Dampens rapid changes, reducing overshoot and ringing. Acts as an anticipator — if error is changing rapidly, D term slows the response. Called 'rate action'."));
ch.push(h4("Steps for Implementing PID in PLC:"));
ch.push(para("Step 1 — Identify the Process Variable (PV): Connect sensor (temperature sensor, pressure transducer, flow meter) to analog input module. Configure analog input for correct range (e.g., 4-20mA for 0-100°C = 0-4095 counts)."));
ch.push(para("Step 2 — Define the Setpoint (SP): Program desired target value into a PLC data register. May come from HMI, thumbwheel switch, or fixed value in program."));
ch.push(para("Step 3 — Configure PID Instruction Block: In Allen-Bradley, PID instruction uses a PD (Process Data) file with: SP, PV address, CV (control variable output), Kp (proportional gain), Ki (integral gain), Kd (derivative gain), max/min output limits."));
ch.push(para("Step 4 — Connect the Output (CV): PID output (CV) drives an analog output module connected to the final control element (valve, heater, variable speed drive)."));
ch.push(para("Step 5 — Tune the PID: Start with I=0, D=0. Increase Kp until oscillation begins, then reduce by half. Gradually add Ki to eliminate offset. Add Kd to reduce overshoot."));
ch.push(h4("PID Ladder Diagram Example — Temperature Control:"));
ch.push(drawNote());
ch.push(cod("SP = 100°C  |  PV = T/C reading on I:1.0  |  CV = heater on O:2.0"));
ch.push(cod(""));
ch.push(cod("L1 ---[ALWAYS_ON]---[PID            ]--- L2"));
ch.push(cod("                     PID Control      "));
ch.push(cod("                     Control Block: PD5:0"));
ch.push(cod("                     Process Var: I:1.0"));
ch.push(cod("                     Control Var: O:2.0"));
ch.push(cod("                     (SP, Kp, Ki, Kd set in PD block)"));
ch.push(h4("PID Tuning Rules:"));
ch.push(mkTable(["Parameter", "Effect of Increasing"], [["Kp (Proportional gain)", "Faster response, but too high → oscillation"], ["Ki (Integral gain)", "Eliminates offset, but too high → integrator windup"], ["Kd (Derivative gain)", "Reduces overshoot, but too high → amplifies noise"]], [3000, 6360]));
ch.push(keyBox("PID, Proportional, Integral, Derivative, Setpoint (SP), Process Variable (PV), Control Variable (CV), Error, Kp, Ki, Kd, Tuning, Feedback, Offset/droop, Overshoot, PD file"));
ch.push(empty());

ch.push(qHdr("M5-Q2", "Explain the combined application of PLC and SCADA systems in Industry 4.0.", "5", "10", "VERY IMPORTANT", "QP2", "1"));
ch.push(simpleBox("PLC handles real-time control at machine level. SCADA supervises from above — monitors all PLCs, logs data, lets operators see the big picture. In Industry 4.0, SCADA and PLCs connect to internet and cloud for smart factory analytics and predictive maintenance."));
ch.push(h4("What is Industry 4.0?"));
ch.push(para("Industry 4.0 is the fourth industrial revolution, characterized by integration of cyber-physical systems, Internet of Things (IoT), cloud computing, big data analytics, and artificial intelligence into manufacturing. It creates smart factories where machines communicate autonomously."));
ch.push(h4("Role of PLC in Industry 4.0:"));
ch.push(blt("Remains at bottom of automation pyramid — performs deterministic real-time control"));
ch.push(blt("Enhanced with Industrial Ethernet (PROFINET, EtherNet/IP) for fast communication"));
ch.push(blt("Built-in OPC-UA (open communication standard) for data sharing with higher-level systems"));
ch.push(blt("Edge computing capability — perform local data analysis before sending to cloud"));
ch.push(blt("Safety PLCs (SIL-rated) integrate safety and standard control in one platform"));
ch.push(h4("Role of SCADA in Industry 4.0:"));
ch.push(blt("Real-time data acquisition from thousands of PLCs across multiple plants"));
ch.push(blt("Cloud connectivity — data stored in cloud for analytics and remote access"));
ch.push(blt("Digital twins — virtual model of plant updated in real time from SCADA data"));
ch.push(blt("Predictive maintenance — AI/ML analyzes trends to predict equipment failures"));
ch.push(blt("Remote monitoring — operators monitor and control from anywhere via web/mobile"));
ch.push(h4("Combined Architecture (Industry 4.0):"));
ch.push(drawNote());
ch.push(cod("       CLOUD (Industry 4.0)"));
ch.push(cod("  ┌──────────────────────────────┐"));
ch.push(cod("  │ Cloud Analytics / AI / ERP   │"));
ch.push(cod("  │ Big data, Predictive maint.  │"));
ch.push(cod("  └──────────────┬───────────────┘"));
ch.push(cod("                 │ Internet / WAN"));
ch.push(cod("  ┌──────────────▼───────────────┐"));
ch.push(cod("  │ SCADA / MES / HMI            │"));
ch.push(cod("  │ Data logging, Alarms, KPIs   │"));
ch.push(cod("  └──────────────┬───────────────┘"));
ch.push(cod("                 │ Industrial Ethernet / PROFINET"));
ch.push(cod("  ┌──────────────▼───────────────┐"));
ch.push(cod("  │ PLC Level (Control Level)    │"));
ch.push(cod("  │ Real-time process control     │"));
ch.push(cod("  │ PLC1 -- PLC2 -- PLC3         │"));
ch.push(cod("  └──────────────┬───────────────┘"));
ch.push(cod("                 │ Field bus / I/O"));
ch.push(cod("  ┌──────────────▼───────────────┐"));
ch.push(cod("  │ Field Level: Sensors, Motors │"));
ch.push(cod("  └──────────────────────────────┘"));
ch.push(keyBox("Industry 4.0, IIoT, PLC, SCADA, Cloud computing, OPC-UA, PROFINET, EtherNet/IP, Digital twin, Predictive maintenance, Big data, AI/ML, Cyber-physical systems, Smart factory"));
ch.push(empty());

ch.push(qHdr("M5-Q3", "What is DCS? Explain how it can overcome the redundancy of PLC.", "5", "10", "VERY IMPORTANT", "QP1, QP2", "2"));
ch.push(simpleBox("DCS = Distributed Control System. Instead of one big PLC (single point of failure), DCS spreads control across many smaller PLCs each controlling locally. If one PLC fails, only that area stops — the rest keeps running. This is how DCS overcomes PLC redundancy limitation."));
ch.push(h4("What is DCS?"));
ch.push(para("A Distributed Control System (DCS) is a network-based control architecture where multiple PLCs are networked together, each controlling a local segment of the overall process. All controllers communicate with a central supervisory system while independently performing local control functions."));
ch.push(h4("DCS Architecture:"));
ch.push(drawNote());
ch.push(cod("       HOST COMPUTER / SUPERVISORY SYSTEM"));
ch.push(cod("  ┌──────────────────────────────────────┐"));
ch.push(cod("  │ Monitoring, Reports, Alarms           │"));
ch.push(cod("  └───────────────┬──────────────────────┘"));
ch.push(cod("                  │ Communication Network"));
ch.push(cod("                  │ (CAT-5/6, Coaxial, Fiber, Ethernet)"));
ch.push(cod("        ┌─────────┼─────────┐"));
ch.push(cod("        ▼         ▼         ▼"));
ch.push(cod("    ┌───────┐ ┌───────┐ ┌───────┐"));
ch.push(cod("    │ PLC 1 │ │ PLC 2 │ │ PLC 3 │"));
ch.push(cod("    │ Area A│ │ Area B│ │ Area C│"));
ch.push(cod("    └───┬───┘ └───┬───┘ └───┬───┘"));
ch.push(cod("        │         │         │"));
ch.push(cod("    Field I/O  Field I/O  Field I/O"));
ch.push(h4("How DCS Overcomes PLC Redundancy:"));
ch.push(para("In a single-PLC system, if the PLC fails, ALL processes stop — total plant shutdown. DCS overcomes this through distributed architecture:"));
ch.push(blt("Failure Isolation: If PLC 1 (Area A) fails, PLC 2 and 3 continue independently — partial operation maintained"));
ch.push(blt("Geographic Distribution: Each PLC placed near its machines — reduces wiring costs and communication distance"));
ch.push(blt("Load Distribution: Processing load shared across multiple CPUs — no single CPU overload"));
ch.push(blt("Communication Redundancy: Multiple paths between PLCs — if one path fails, alternatives used"));
ch.push(blt("Power Redundancy: Each local PLC has own power supply — one PSU failure doesn't halt everything"));
ch.push(h4("Communication in DCS:"));
ch.push(mkTable(["Cable Type", "Distance", "Advantage"], [["CAT-5/6 Twisted Pair", "Short (within building)", "Standard, inexpensive"], ["Coaxial Cable", "Over 2 miles", "Longer distance, more noise susceptibility"], ["Fiber Optic Cable", "Over 20 miles", "Immune to electrical noise, ideal for high-interference"], ["Industrial Ethernet", "High speed", "PROFINET/EtherNet/IP — modern DCS standard"]], [2000, 2000, 5360]));
ch.push(h4("DCS vs Single PLC Comparison:"));
ch.push(mkTable(["Feature", "Single PLC System", "DCS (Distributed)"], [["Failure Impact", "Total plant stoppage", "Only affected area stops"], ["Scalability", "Limited by CPU capacity", "Unlimited — add more PLCs"], ["Wiring", "All field devices to one panel", "Local wiring — less cable"], ["Processing", "One CPU for all tasks", "Multiple CPUs in parallel"], ["Maintenance", "Entire system shutdown", "Maintain one PLC without stopping others"], ["Reliability", "Single point of failure", "High — distributed redundancy"]], [2500, 3430, 3430]));
ch.push(keyBox("DCS, Distributed Control System, Redundancy, Failure isolation, Communication network, CAT-5/6, Coaxial cable, Fiber optic, Host computer, Local control, Geographic distribution, Single point of failure"));
ch.push(empty());

ch.push(qHdr("M5-Q4/Q8", "Discuss the selection criterion for PLC based on application requirements.", "5", "10", "VERY IMPORTANT", "QP1, QP2", "2"));
ch.push(simpleBox("Choosing the right PLC: consider how many I/Os you need, what voltages they use, how fast the machine runs, communication needs, environment harshness, and cost. Like choosing the right tool for a job."));
ch.push(h4("1. System Requirements:"));
ch.push(para("Understand the complete control objectives. Break the task into smaller elements, each easily defined and implemented. Determine if standard PLC or Safety PLC (SIL-rated) is required. Decide fixed vs modular I/O architecture."));
ch.push(h4("2. I/O Count and Types (most critical criterion):"));
ch.push(para("Count discrete inputs (pushbuttons, sensors) and discrete outputs (contactors, solenoids). Count analog inputs (temperature, pressure) and analog outputs (valve control, VSD). Add 20-25% spare capacity for future expansion."));
ch.push(h4("3. Electrical Requirements:"));
ch.push(para("Determine field device voltage: 24VDC, 120VAC, or 240VAC inputs. Choose output type: relay (AC/DC flexible, 2A), transistor (DC fast, 1A), or triac (AC direct). Verify power supply requirements match available power."));
ch.push(h4("4. Speed of Operation:"));
ch.push(para("High-speed applications (packaging, servo control) need scan time under 1ms. Standard industrial control: 5-20ms scan time. Check if high-speed counter inputs are needed for encoders."));
ch.push(h4("5. Communication Requirements:"));
ch.push(para("Identify if PLC needs to communicate with: SCADA systems, HMI touch panels, other PLCs (DCS), computers, field bus devices (Profibus, DeviceNet, EtherNet/IP). Select PLC with built-in or optional communication modules."));
ch.push(h4("6. Operator Interface:"));
ch.push(para("Simple pushbuttons and lights vs HMI touch screen vs web-based SCADA. Select compatible HMI software from same manufacturer for easier integration."));
ch.push(h4("7. Physical Environment:"));
ch.push(para("Temperature range (standard: 0-60°C), humidity (condensing/non-condensing), vibration and shock, IP rating (IP65 for washdown areas), EMI/RFI immunity requirements."));
ch.push(h4("8. Memory Size:"));
ch.push(para("Program complexity determines memory. Rule of thumb: 1K memory per 1000 contacts/coils. Typical: 2K-4K for simple, 8K-32K for medium, 64K-1MB+ for complex. Also consider data memory for recipes and logging."));
ch.push(h4("9. Manufacturer Support:"));
ch.push(para("Training availability, technical support quality, spare parts lead time, documentation quality, local distributor presence, software update compatibility."));
ch.push(h4("10. Cost:"));
ch.push(para("Balance initial cost with long-term total cost of ownership: hardware + software + installation + training + ongoing support. PLCs with higher initial cost often have lower maintenance costs."));
ch.push(h4("Summary Table:"));
ch.push(mkTable(["Criterion", "Key Question"], [["System Requirements", "What must the system do? Is Safety PLC needed?"], ["I/O Count and Types", "How many inputs/outputs? Discrete or Analog?"], ["Electrical Requirements", "What voltages? AC or DC? Relay, transistor, or triac output?"], ["Speed of Operation", "How fast must it respond? High-speed counter needed?"], ["Communication", "SCADA? HMI? DCS? Which protocol?"], ["Operator Interface", "Pushbuttons? HMI? Web interface?"], ["Physical Environment", "Temperature? IP rating? Vibration? EMI?"], ["Memory Size", "How complex is the program? Recipe storage needed?"], ["Manufacturer Support", "Training? Spare parts? Local distributor?"], ["Cost", "Total cost of ownership, not just purchase price"]], [3000, 6360]));
ch.push(keyBox("I/O count, Discrete I/O, Analog I/O, Electrical requirements, Speed of operation, Communication (PROFINET, EtherNet/IP), HMI, IP rating, Memory size, Manufacturer support, Safety PLC, Scan time, Total cost of ownership"));
ch.push(empty());

ch.push(qHdr("M5-Q6", "Mention the objectives and functions of SCADA.", "5", "8", "IMPORTANT", "QP1", "1"));
ch.push(simpleBox("SCADA = Supervisory Control and Data Acquisition. Objectives: monitor everything, log all data, alert operators to problems. Functions: data collection, display, trending, alarms, reports, recipe management. Key: SCADA SEES — PLCs DO."));
ch.push(h4("Objectives of SCADA:"));
ch.push(blt("Supervisory Control: Allow operators to monitor and control industrial processes from central location"));
ch.push(blt("Data Acquisition: Continuously collect real-time data from PLCs and field instruments across plant"));
ch.push(blt("Process Visibility: Provide real-time graphical display of process conditions (mimics, trend charts, dashboards)"));
ch.push(blt("Fault Detection: Rapidly detect abnormal process conditions and alert operators before failures escalate"));
ch.push(blt("Historical Analysis: Store process data for analysis, quality reporting, and regulatory compliance"));
ch.push(h4("Functions of SCADA:"));
ch.push(mkTable(["Function", "Description"], [["Data Collection and Logging", "Automatic, timestamped storage of process data from all PLCs"], ["Process Monitoring", "Real-time graphical display of temperatures, pressures, flow rates, levels"], ["Trending", "Historical data visualization — plot variable vs. time to identify patterns"], ["Alarm Handling", "Audible/visual alerts when variables exceed limits; alarm logging and acknowledgment"], ["Recipe Management", "Download different process parameters for different products to PLCs"], ["Report Generation", "Automatic production, shift, quality, energy consumption reports"], ["Remote Control", "Operator starts/stops/adjusts processes via SCADA workstation"], ["Communication", "Gateway between PLCs (OT network) and enterprise systems (ERP, MES)"]], [3000, 6360]));
ch.push(h4("SCADA Architecture:"));
ch.push(drawNote());
ch.push(cod("  ┌────────────────────────────────────┐"));
ch.push(cod("  │ SCADA HOST (Control Room)           │"));
ch.push(cod("  │ - HMI displays (mimics, trends)     │"));
ch.push(cod("  │ - Historian database                 │"));
ch.push(cod("  │ - Alarm server                       │"));
ch.push(cod("  └─────────────────┬──────────────────┘"));
ch.push(cod("                    │ LAN / WAN / Ethernet"));
ch.push(cod("         ┌──────────┼──────────┐"));
ch.push(cod("         ▼          ▼          ▼"));
ch.push(cod("     ┌───────┐  ┌───────┐  ┌───────┐"));
ch.push(cod("     │ RTU 1 │  │ PLC 2 │  │ PLC 3 │"));
ch.push(cod("     └───────┘  └───────┘  └───────┘"));
ch.push(cod("     (Remote)   (Local)     (Local)"));
ch.push(colorBox("CRITICAL NOTE: SCADA does NOT control in real time — PLCs perform real-time control. SCADA is supervisory — it monitors, logs, and gives operators an overview.", WARN_BG, RED, true));
ch.push(keyBox("SCADA, Supervisory Control and Data Acquisition, HMI, Historian, Alarm server, Trending, Data logging, Recipe management, Remote monitoring, RTU, OPC server, Process mimics, Alarm handling"));
ch.push(empty());

ch.push(qHdr("M5-Q7", "Explain the importance of PLC maintenance.", "5", "12", "IMPORTANT", "QP1", "1"));
ch.push(simpleBox("Maintenance = preventing unexpected breakdowns. Just like servicing a car prevents engine failure, PLC maintenance prevents production stoppages. Tasks: clean filters, check connections, calibrate sensors, check battery, backup program, use lockout/tagout safety."));
ch.push(h4("Why PLC Maintenance is Important:"));
ch.push(para("PLCs control critical industrial processes. Unexpected PLC failure causes production downtime, product quality issues, safety hazards, and significant financial losses. A structured maintenance program prevents these through proactive care rather than reactive repair."));
ch.push(h4("A. Physical Cleaning:"));
ch.push(blt("Clean or replace enclosure air filters every 3-6 months — prevents overheating"));
ch.push(blt("Remove dust from circuit boards with compressed air — prevents short circuits and thermal issues"));
ch.push(blt("Keep heat-generating equipment (transformers, reactors) away from PLC enclosures"));
ch.push(h4("B. Electrical Checks:"));
ch.push(blt("Check I/O module terminal connections for tightness every 6 months (vibration loosens them)"));
ch.push(blt("Inspect wiring for insulation damage, chafing, or corrosion"));
ch.push(blt("Check power supply output voltages (24VDC, 5VDC) — low voltage causes unreliable operation"));
ch.push(h4("C. Battery Maintenance (CRITICAL):"));
ch.push(para("PLC RAM is backed up by a lithium battery to retain program during power failure. Must be checked regularly."));
ch.push(blt("Check CPU battery indicator (BATT LED) at least annually"));
ch.push(blt("Replace battery every 2-5 years per manufacturer specification"));
ch.push(blt("Never replace battery with power OFF — program will be lost; replace with power ON or have EEPROM backup"));
ch.push(h4("D. I/O Device Calibration:"));
ch.push(blt("Calibrate analog input boards every 6 months to maintain measurement accuracy"));
ch.push(blt("Verify sensor readings match actual physical measurements (zero and span calibration)"));
ch.push(blt("Test discrete inputs and outputs for proper switching function"));
ch.push(h4("E. Program Backup (Most Critical Task):"));
ch.push(blt("Backup program to EEPROM module, USB drive, and network server after any modification"));
ch.push(blt("Document all program changes with date, reason, and author"));
ch.push(blt("Store backups off-site to protect against fire or disaster"));
ch.push(blt("Keep a master copy of operating programs"));
ch.push(h4("Safety Rules for Maintenance:"));
ch.push(blt("Always remove power before checking/modifying wiring connections"));
ch.push(blt("De-energize pneumatic and hydraulic systems before working on machine"));
ch.push(blt("Use lockout/tagout (LOTO) procedures — physically lock power isolator in OFF position"));
ch.push(blt("Never insert or remove I/O modules with power applied"));
ch.push(h4("LED Troubleshooting Guide:"));
ch.push(mkTable(["LED", "State", "Meaning and Action"], [["RUN", "Green steady", "Processor in RUN mode — normal operation"], ["RUN", "Green flashing", "Transferring program from RAM to memory module"], ["RUN", "OFF", "Processor in PROG mode or fault — check FLT LED"], ["FLT", "Red flashing at power-up", "Processor not configured — needs programming"], ["FLT", "Red flashing during run", "Major error in processor, chassis, or memory"], ["FLT", "Red steady", "Fatal error — no communication; replace module"], ["BATT", "Red steady", "Battery voltage low — replace battery soon"]], [1500, 2000, 5860]));
ch.push(h4("Preventive Maintenance Schedule:"));
ch.push(mkTable(["Frequency", "Task"], [["Daily", "Check LED status, monitor for abnormal process conditions"], ["Monthly", "Check filter cleanliness, check for unusual odors or heat"], ["Quarterly", "Check terminal connection tightness, check battery indicator"], ["Bi-annually", "Calibrate analog boards, update program backup, full system test"], ["Every 2-5 years", "Replace lithium battery, check EEPROM backup integrity"]], [2000, 7360]));
ch.push(keyBox("Preventive maintenance, Air filter, Circuit board cleaning, Battery backup, BATT LED, Calibration, Program backup, EEPROM, Lockout/tagout (LOTO), Terminal connections, Power supply, RUN LED, FLT LED, Watchdog timer"));
ch.push(empty());

ch.push(h2("5.4 Quick Revision — Module 5"));
ch.push(colorBox("PID: P=fast (has droop), I=eliminates offset, D=reduces overshoot; Formula: Kp×E + Ki×∫E + Kd×dE/dt\nSCADA: Supervisory — data collection, trending, alarms, reports, recipes — does NOT control in real time\nDCS: Distributed PLCs — one PLC fails = only that area stops = redundancy through distribution\nIndustry 4.0: IIoT + Cloud + AI + Digital twins + OPC-UA + PROFINET\nMaintenance: 'C-C-C-C-C-B' = Clean, Check, Calibrate, Copy, Communicate, Battery\nSelection: I/O count, electrical, speed, communication, environment, memory, cost\nLED: RUN=green | FLT=red flash=error/solid=fatal | BATT=red=low battery", SUCCESS_BG));
ch.push(h2("5.5 Mind Map — Module 5"));
ch.push(cod("ADVANCED PLC (Module 5)"));
ch.push(cod("├── PID Control"));
ch.push(cod("│   ├── P: fast response but offset"));
ch.push(cod("│   ├── I: eliminates offset (integral)"));
ch.push(cod("│   ├── D: reduces overshoot (derivative)"));
ch.push(cod("│   └── Tuning: Kp, Ki, Kd"));
ch.push(cod("├── SCADA"));
ch.push(cod("│   ├── Supervisory monitoring only"));
ch.push(cod("│   ├── Data logging + trending + alarms"));
ch.push(cod("│   └── NOT real-time control"));
ch.push(cod("├── DCS"));
ch.push(cod("│   ├── Multiple networked PLCs"));
ch.push(cod("│   ├── Each controls locally"));
ch.push(cod("│   └── One failure ≠ total failure"));
ch.push(cod("├── Industry 4.0"));
ch.push(cod("│   ├── IIoT + Cloud + AI"));
ch.push(cod("│   ├── OPC-UA, PROFINET, EtherNet/IP"));
ch.push(cod("│   └── Digital twins + Predictive maintenance"));
ch.push(cod("├── Maintenance"));
ch.push(cod("│   ├── Clean filters + boards"));
ch.push(cod("│   ├── Check connections + battery"));
ch.push(cod("│   ├── Calibrate sensors"));
ch.push(cod("│   └── Backup program (most critical)"));
ch.push(cod("└── Selection Criteria"));
ch.push(cod("    ├── I/O count + types"));
ch.push(cod("    ├── Electrical requirements"));
ch.push(cod("    ├── Speed + communication"));
ch.push(cod("    └── Environment + cost"));
ch.push(h2("5.6 Memory Tricks — Module 5"));
ch.push(colorBox("PID: 'Pretty Important Decisions'\nP=Proportional (immediate) | I=Integral (integrates over time) | D=Derivative (rate change)\nSCADA vs DCS: 'SCADA SEES AND ALERTS' (supervisory) vs 'DCS DIVIDES CONTROL' (distributed)\nMaintenance: 'C-C-C-C-C-B' = Clean, Check connections, Calibrate, Copy backup, Communicate, Battery\nLED: 'R=Running, F=Fault, B=Battery' (RUN, FLT, BATT)", KEY_BG));
ch.push(pgBreak());

// ============ EXAM PRIORITY ============
ch.push(h1("EXAM PRIORITY ANALYSIS"));
ch.push(h2("Most Repeated Questions — Ranked"));
ch.push(mkTable(["Rank", "Question", "Count", "Priority"], [
    ["1", "PLC Architecture & Components (M1)", "3 QPs", "VERY IMPORTANT"],
    ["2", "Relay vs PLC comparison (M1)", "3 QPs", "VERY IMPORTANT"],
    ["3", "AND/OR/NOT Ladder + Truth Tables (M2)", "3 QPs", "VERY IMPORTANT"],
    ["4", "Timer ON/OFF Delay (M3)", "3 QPs", "VERY IMPORTANT"],
    ["5", "Math ops ADD/SUB/MUL/DIV (M3)", "3 QPs", "VERY IMPORTANT"],
    ["6", "Count Up / Count Down Counters (M3)", "2+ QPs", "VERY IMPORTANT"],
    ["7", "MOVE Function (M4)", "2 QPs", "VERY IMPORTANT"],
    ["8", "FIFO and LIFO (M4)", "2 QPs", "VERY IMPORTANT"],
    ["9", "Shift Register (M4)", "2 QPs", "VERY IMPORTANT"],
    ["10", "PID Control (M5)", "2 QPs", "VERY IMPORTANT"],
    ["11", "SCADA Functions (M5)", "2 QPs", "IMPORTANT"],
    ["12", "DCS Architecture (M5)", "2 QPs", "VERY IMPORTANT"],
    ["13", "PLC Selection Criteria (M5)", "2 QPs", "VERY IMPORTANT"],
    ["14", "Conveyor with Timer (M3)", "2 QPs", "VERY IMPORTANT"],
    ["15", "MCR Function (M4)", "2 QPs", "IMPORTANT"],
], [800, 5500, 1200, 2060]));
ch.push(empty());
ch.push(h2("High Probability Questions for Future Exams"));
ch.push(colorBox("ALMOST CERTAIN TO APPEAR (based on 3-QP pattern analysis):\n1. PLC Architecture Diagram + all component functions (draw the block diagram!)\n2. Ladder Logic for AND/OR/NOT/XOR gates with truth tables\n3. Timer-based control (conveyor/temperature regulation)\n4. Counter (up/down counter with application)\n5. FIFO vs LIFO differences and applications\n6. MOVE function with example\n7. PID control block diagram + implementation steps\n8. SCADA architecture and functions\n9. Relay vs PLC comparison table\n10. Temperature conversion ladder program (F=9C/5+32)", KEY_BG));
ch.push(pgBreak());

// ============ LAST NIGHT SECTION ============
ch.push(h1("LAST NIGHT BEFORE EXAM — EMERGENCY REVISION"));
ch.push(h2("Top 20 Most Important Questions"));
ch.push(mkTable(["#", "Question", "Marks", "Module"], [
    ["1", "Explain PLC architecture with block diagram", "10", "1"],
    ["2", "Differentiate Relay vs PLC (table of 10 differences)", "10", "1"],
    ["3", "Advantages and Disadvantages of PLC", "10", "1"],
    ["4", "Ladder diagram for AND, OR, NOT with truth table", "10", "2"],
    ["5", "Start-Stop-Seal (motor latch) circuit", "10", "2"],
    ["6", "Forward-Reverse with mutual interlocks", "10", "2"],
    ["7", "Liquid level control PLC program", "10", "2"],
    ["8", "Timer ON Delay with timing diagram", "8", "3"],
    ["9", "Timer OFF Delay with example and timing diagram", "8", "3"],
    ["10", "Count Up + Count Down counter with application", "10", "3"],
    ["11", "Math ops ADD/SUB/MUL/DIV with examples", "12", "3"],
    ["12", "Temperature conversion (C to F) ladder program", "10", "3"],
    ["13", "Vessel overfill detection using SUB instruction", "10", "3"],
    ["14", "MOVE function with applications", "10", "4"],
    ["15", "MCR function with MCT example", "12", "4"],
    ["16", "FIFO vs LIFO comparison and applications", "10", "4"],
    ["17", "Shift register — 8-bit example step-by-step", "10", "4"],
    ["18", "PID control — P/I/D modes + implementation in PLC", "12", "5"],
    ["19", "SCADA architecture and functions", "8", "5"],
    ["20", "DCS and how it overcomes PLC single-point-of-failure", "10", "5"],
], [400, 5500, 1000, 900]));
ch.push(empty());

ch.push(h2("Top Definitions to Remember"));
ch.push(mkTable(["Term", "Definition"], [
    ["PLC", "Industrial-grade digital computer for control functions using programmed logic instead of hard-wired relays"],
    ["Scan Cycle", "4-step PLC operation: Input Scan → Program Execution → Output Scan → Housekeeping"],
    ["Ladder Diagram", "Graphical PLC programming language using rungs and rails, resembling relay schematics"],
    ["NO Contact", "Normally Open — passes current when input is energized (ON)"],
    ["NC Contact", "Normally Closed — passes current when input is NOT energized (OFF)"],
    ["TON", "Timer On Delay — output turns ON after preset time once input goes true"],
    ["TOF", "Timer Off Delay — output turns OFF after preset time once input goes false"],
    ["CTU", "Count Up Counter — increments on each FALSE-to-TRUE transition"],
    ["CTD", "Count Down Counter — decrements on each transition"],
    ["MOVE", "Copies data from source to destination; source unchanged, destination overwritten"],
    ["FIFO", "First In First Out — first data stored is first retrieved (queue analogy)"],
    ["LIFO", "Last In First Out — last data stored is first retrieved (stack analogy)"],
    ["MCR", "Master Control Relay — when OFF, forces all non-retentive outputs in zone to OFF"],
    ["PID", "Proportional-Integral-Derivative control algorithm minimizing error in feedback systems"],
    ["SCADA", "Supervisory Control and Data Acquisition — monitors PLCs without real-time control"],
    ["DCS", "Distributed Control System — network of PLCs each controlling local processes"],
    ["Optical Isolator", "Circuit using light to electrically isolate high-voltage field from low-voltage CPU"],
    ["Latch Coil", "Output that turns ON and STAYS ON even after input condition goes FALSE"],
    ["RLC", "Relay Logic Controller — traditional hard-wired relay panel, predecessor to PLC"],
    ["Mutual Interlock", "NC contact of each direction in the other's rung — prevents simultaneous energizing"],
], [2000, 7360]));
ch.push(empty());

ch.push(h2("Top PLC Ladder Programs to Memorize"));
ch.push(cod("1. AND:  L1 ---[ A ]---[ B ]---( Y )--- L2"));
ch.push(empty());
ch.push(cod("2. OR:   L1 ---[ A ]---+---( Y )--- L2"));
ch.push(cod("             ---[ B ]--+"));
ch.push(empty());
ch.push(cod("3. XOR:  L1 ---[ A ]---[/B]---+---( Y )--- L2"));
ch.push(cod("             ---[/A]---[ B]--+"));
ch.push(empty());
ch.push(cod("4. START-STOP-SEAL:"));
ch.push(cod("   L1 ---[/STOP]---[START]---+---( MOTOR )--- L2"));
ch.push(cod("                              +---[MOTOR ]--+"));
ch.push(empty());
ch.push(cod("5. FORWARD-REVERSE INTERLOCK:"));
ch.push(cod("   RUNG 1: L1 --[/STOP]--[FWD]--[/REV_CTR]--+--( FWD_CTR )-- L2"));
ch.push(cod("                                              +--[FWD_CTR]--+"));
ch.push(cod("   RUNG 2: L1 --[/STOP]--[REV]--[/FWD_CTR]--+--( REV_CTR )-- L2"));
ch.push(cod("                                              +--[REV_CTR]--+"));
ch.push(empty());
ch.push(cod("6. LIQUID LEVEL:"));
ch.push(cod("   L1 ---[/LS_HIGH]---[LS_LOW]---+---( PUMP )--- L2"));
ch.push(cod("                                   +---[PUMP ]--+"));
ch.push(empty());
ch.push(cod("7. CONVEYOR 5s DELAY (TON):"));
ch.push(cod("   RUNG 1: L1 --[/STOP]--[START]--+--[T4:0 TON Pre=5 TB=1s]-- L2"));
ch.push(cod("                                   +--[T4:0/EN]--+"));
ch.push(cod("   RUNG 2: L1 ---[T4:0/DN]---( CONVEYOR )--- L2"));
ch.push(empty());
ch.push(cod("8. PART COUNTER (CTU):"));
ch.push(cod("   R1: L1 ---[SENSOR]---[C5:0 CTU Pre=100]--- L2"));
ch.push(cod("   R2: L1 ---[C5:0/DN]---( ALARM )--- L2"));
ch.push(cod("   R3: L1 ---[RESET ]---[C5:0 RES]--- L2"));
ch.push(empty());
ch.push(cod("9. TEMPERATURE C TO F (5 rungs):"));
ch.push(cod("   R1: [FRD: I:012 → N7:0]  (BCD to binary)"));
ch.push(cod("   R2: [MUL: N7:0 × 9 → N7:1]"));
ch.push(cod("   R3: [DIV: N7:1 ÷ 5 → N7:2]"));
ch.push(cod("   R4: [ADD: N7:2 + 32 → N7:3]  (= Final °F)"));
ch.push(cod("   R5: [TOD: N7:3 → O:013]  (binary to BCD for display)"));
ch.push(empty());
ch.push(cod("10. MCR ZONE:"));
ch.push(cod("    L1 ---[MASTER_EN]---[MCR]--- L2  (zone start)"));
ch.push(cod("    L1 ---[cond1]---( OUTPUT1 )--- L2  (inside zone)"));
ch.push(cod("    L1 ---[   ]---[MCT]--- L2          (zone end)"));
ch.push(empty());

ch.push(h2("Quick Formula Sheet"));
ch.push(mkTable(["Formula/Rule", "Value/Description"], [
    ["Timer Total Time", "Preset Value × Time Base"],
    ["Timer Example", "Pre=10, TB=1.0s → 10 × 1.0s = 10 seconds"],
    ["Temperature Conversion", "F = (9 × C / 5) + 32"],
    ["C=0°C → F=32°F", "Freezing point verification"],
    ["C=100°C → F=212°F", "Boiling point verification"],
    ["Counter DN bit fires when", "Accumulated Value >= Preset Value"],
    ["PLC Memory Rule", "1K memory ≈ 1000 coils/contacts"],
    ["1 Word", "= 16 bits | 1 byte = 8 bits"],
    ["Analog input range", "4-20mA or 0-10V (standard ranges)"],
    ["Coaxial cable remote I/O", "Up to 2 miles from CPU"],
    ["Fiber optic remote I/O", "Over 20 miles from CPU"],
    ["PID Formula", "Output = Kp×E + Ki×∫E dt + Kd×(dE/dt)"],
], [4000, 5360]));
ch.push(empty());
ch.push(h2("Frequently Repeated VTU Questions"));
ch.push(colorBox("GUARANTEED TO APPEAR (all 3 QPs + IAT confirm these):\n\n1. Explain PLC architecture with block diagram (10 marks — Module 1)\n2. Differentiate Relay vs PLC with 10-point table (10 marks — Module 1)\n3. Draw ladder diagrams for AND/OR/NOT with truth tables (10 marks — Module 2)\n4. Write PLC program for start-stop motor control (10 marks — Module 2)\n5. Explain Timer ON Delay with ladder diagram and timing diagram (8-10 marks — Module 3)\n6. Explain count up and count down counters with application (10 marks — Module 3)\n7. Example arithmetic operations ADD/SUB/MUL/DIV in PLC (12 marks — Module 3)\n8. Explain MOVE instruction with application (10 marks — Module 4)\n9. Explain FIFO and LIFO with comparison (10 marks — Module 4)\n10. Describe PID control and implementation in PLC (12 marks — Module 5)\n11. Explain SCADA functions and objectives (8-10 marks — Module 5)\n12. Discuss DCS and its advantages over single PLC (10 marks — Module 5)", WARN_BG, RED));
ch.push(empty());
ch.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 400 }, children: [new TextRun({ text: "ALL THE BEST FOR YOUR EXAM!", bold: true, size: 36, color: RED, font: "Arial" })] }));
ch.push(new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "BRI515A — Introduction to PLC | All 44 Questions Answered | BIT | VTU", size: 20, color: "555555", font: "Arial" })] }));

const doc = new Document({
    numbering: { config: [{ reference: "bullets", levels: [{ level: 0, format: LevelFormat.BULLET, text: "\u2022", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] }] },
    styles: { default: { document: { run: { font: "Arial", size: 20 } } } },
    sections: [{
        properties: { page: { size: { width: 12240, height: 15840 }, margin: { top: 1080, right: 1080, bottom: 1080, left: 1080 } } },
        children: ch
    }]
});

Packer.toBuffer(doc).then(buf => {
    fs.writeFileSync('c:/Users/ACER/OneDrive/Desktop/portfolio/PLC_Complete_Exam_Handbook.docx', buf);
    console.log('SUCCESS! Document created.');
}).catch(err => { console.error('ERROR:', err.message); process.exit(1); });
