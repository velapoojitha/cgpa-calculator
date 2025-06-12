        const numSemesters = 4, numSubjects = 5;
        let failedSubjects = 0;
        let failedInFirstYear = false;

        const gradeToPoints = {
            "A": 10, "B": 9, "C": 8, "D": 7, "E": 6, "F": 0 // 'F' is fail
        };

        function createSemesterUI() {
            let container = document.getElementById("semesters");

            for (let sem = 1; sem <= numSemesters; sem++) {
                let semesterDiv = document.createElement("div");
                semesterDiv.className = "semester";
                semesterDiv.id = "semester" + sem;
                semesterDiv.innerHTML = `<h3>Semester ${sem}</h3>`;

                for (let subj = 1; subj <= numSubjects; subj++) {
                    let input = document.createElement("input");
                    input.type = "text";
                    input.id = `grade_${sem}_${subj}`;
                    input.placeholder = `Subject ${subj} Grade`;
                    semesterDiv.appendChild(input);
                }

                let button = document.createElement("button");
                button.innerText = "Calculate Semester CGPA";
                button.id = `calculateBtn_${sem}`;
                button.onclick = () => calculateSemesterCGPA(sem);
                semesterDiv.appendChild(button);

                let result = document.createElement("h3");
                result.id = "cgpa_" + sem + "_result";
                semesterDiv.appendChild(result);

                container.appendChild(semesterDiv);
            }
        }

        function calculateSemesterCGPA(semester) {
            let totalPoints = 0, failCount = 0;
            for (let subj = 1; subj <= numSubjects; subj++) {
                let grade = document.getElementById(`grade_${semester}_${subj}`).value.toUpperCase();
                
                if (!gradeToPoints.hasOwnProperty(grade)) {
                    alert(`Please enter a valid grade (A, B, C, D, E, F) for Subject ${subj} in Semester ${semester}`);
                    return;
                }

                totalPoints += gradeToPoints[grade];
                if (grade === "F") failCount++;
            }

            let semesterCGPA = (totalPoints / numSubjects).toFixed(2);
            document.getElementById(`cgpa_${semester}_result`).innerText = `Semester CGPA: ${semesterCGPA}`;

            if (semester <= 2) failedSubjects += failCount;

            // If failed in more than 6 subjects in first year, disable Semester 3 & 4
            if (failedSubjects > 6) {
                failedInFirstYear = true;
                document.getElementById("promotionMessage").innerText = "Not eligible for Semesters 3 & 4 due to excessive failures.";
                disableSemester(3, true);
                disableSemester(4, true);
            }

            checkOverallButtonStatus();
        }

        function calculateOverallCGPA() {
            if (failedInFirstYear) {
                document.getElementById("overallCGPA").innerText = "Not eligible for overall CGPA due to excessive failures.";
                return;
            }

            let totalCGPA = 0, validSemesters = 0;
            for (let sem = 1; sem <= numSemesters; sem++) {
                let cgpaText = document.getElementById(`cgpa_${sem}_result`).innerText;
                if (cgpaText.includes("Semester CGPA")) {
                    let cgpa = parseFloat(cgpaText.split(": ")[1]);
                    totalCGPA += cgpa;
                    validSemesters++;
                }
            }

            if (validSemesters === numSemesters) {
                let overallCGPA = (totalCGPA / numSemesters).toFixed(2);
                document.getElementById("overallCGPA").innerText = `Overall CGPA: ${overallCGPA}`;
            } else {
                document.getElementById("overallCGPA").innerText = "Complete all semesters first.";
            }
        }

        function disableSemester(semester, disable) {
            let inputs = document.querySelectorAll(`#semester${semester} input`);
            let button = document.getElementById(`calculateBtn_${semester}`);
            inputs.forEach(input => input.disabled = disable);
            if (button) button.disabled = disable;
        }

        function checkOverallButtonStatus() {
            let completed = 0;
            for (let sem = 1; sem <= numSemesters; sem++) {
                if (document.getElementById(`cgpa_${sem}_result`).innerText.includes("Semester CGPA")) {
                    completed++;
                }
            }

            document.getElementById("calculateOverallBtn").disabled = (completed !== numSemesters || failedInFirstYear);
        }

        // Initialize UI
        createSemesterUI();
    