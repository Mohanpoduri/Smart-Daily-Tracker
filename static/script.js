/**
 * Smart Daily Planner - JavaScript & jQuery (v2.0)
 * ==================================================
 * Features: Form validation, filtering, live clock,
 *           reminder system, alarm for high priority,
 *           routine validation, and UI animations.
 */

$(document).ready(function () {

    // ============================================================
    // LIVE CLOCK - Updates every second in the navbar
    // ============================================================
    function updateClock() {
        var now = new Date();
        var options = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
        $('#live-clock').text(now.toLocaleTimeString('en-US', options));
    }
    updateClock();
    setInterval(updateClock, 1000);

    // ============================================================
    // FORM VALIDATION - Task form
    // ============================================================
    $('#task-form').on('submit', function (e) {
        var taskInput = $('#task-input');
        var taskValue = taskInput.val().trim();

        if (taskValue === '') {
            e.preventDefault();
            taskInput.addClass('is-invalid');
            taskInput.focus();
            showAlert('Please enter a task description!', 'danger');
            return false;
        }

        taskInput.removeClass('is-invalid');
        $('#add-task-btn').html('<i class="bi bi-hourglass-split me-1"></i> Adding...').prop('disabled', true);
        return true;
    });

    // Remove validation error on input
    $('#task-input').on('input', function () {
        if ($(this).val().trim() !== '') {
            $(this).removeClass('is-invalid');
        }
    });

    // ============================================================
    // FORM VALIDATION - Routine form
    // ============================================================
    $('#routine-form').on('submit', function (e) {
        var routineInput = $('#routine-input');
        var routineValue = routineInput.val().trim();

        if (routineValue === '') {
            e.preventDefault();
            routineInput.addClass('is-invalid');
            routineInput.focus();
            showAlert('Please enter a routine activity!', 'danger');
            return false;
        }

        routineInput.removeClass('is-invalid');
        return true;
    });

    $('#routine-input').on('input', function () {
        if ($(this).val().trim() !== '') {
            $(this).removeClass('is-invalid');
        }
    });

    // ============================================================
    // FILTER BUTTONS - Filter tasks by priority / status
    // ============================================================
    $('.btn-filter').on('click', function () {
        var filter = $(this).data('filter');

        // Update active state
        $('.btn-filter').removeClass('active');
        $(this).addClass('active');

        // Filter task items
        if (filter === 'all') {
            $('.task-item').each(function (index) {
                $(this).stop(true, true).delay(index * 50).fadeIn(300);
            });
        } else if (filter === 'pending' || filter === 'done') {
            // Filter by completion status
            $('.task-item').each(function () {
                if ($(this).data('status') === filter) {
                    $(this).stop(true, true).fadeIn(300);
                } else {
                    $(this).stop(true, true).fadeOut(200);
                }
            });
        } else {
            // Filter by priority
            $('.task-item').each(function () {
                if ($(this).data('priority') === filter) {
                    $(this).stop(true, true).fadeIn(300);
                } else {
                    $(this).stop(true, true).fadeOut(200);
                }
            });
        }
    });

    // ============================================================
    // FLASH MESSAGE AUTO-DISMISS - Fades out after 4 seconds
    // ============================================================
    setTimeout(function () {
        $('.flash-alert').fadeOut(500, function () {
            $(this).remove();
        });
    }, 4000);

    // ============================================================
    // CUSTOM ALERT FUNCTION - Shows temporary notification
    // ============================================================
    function showAlert(message, type) {
        var alertHtml = '<div class="alert alert-' + type + ' alert-dismissible fade show flash-alert" role="alert">' +
            '<i class="bi bi-exclamation-triangle-fill me-2"></i>' + message +
            '<button type="button" class="btn-close" data-bs-dismiss="alert"></button></div>';

        var alertElement = $(alertHtml).hide();
        $('.hero-section').after(alertElement);
        alertElement.fadeIn(300);

        setTimeout(function () {
            alertElement.fadeOut(500, function () { $(this).remove(); });
        }, 3000);
    }

    // ============================================================
    // TASK ITEM ENTRANCE ANIMATION
    // ============================================================
    $('.task-item').each(function (index) {
        $(this).css('opacity', '0');
        $(this).delay(index * 80).animate({ opacity: 1 }, 400);
    });

    // ============================================================
    // REMINDER & ALARM SYSTEM
    // ============================================================

    // Audio context for alarm sound (using Web Audio API)
    var alarmAudioCtx = null;
    var alarmOscillator = null;
    var alarmPlaying = false;

    // Stores which reminders have already been triggered (to avoid repeats)
    var triggeredReminders = {};

    /**
     * Creates and plays an alarm sound using Web Audio API.
     * Uses an oscillator to generate a beeping pattern.
     */
    function playAlarmSound() {
        if (alarmPlaying) return;
        alarmPlaying = true;

        try {
            alarmAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
            var gainNode = alarmAudioCtx.createGain();
            gainNode.connect(alarmAudioCtx.destination);
            gainNode.gain.value = 0.3;

            // Play a sequence of beeps
            var beepCount = 0;
            var maxBeeps = 20; // Beep 20 times then stop

            function playBeep() {
                if (beepCount >= maxBeeps || !alarmPlaying) {
                    stopAlarmSound();
                    return;
                }

                var osc = alarmAudioCtx.createOscillator();
                osc.type = 'square';
                osc.frequency.value = beepCount % 2 === 0 ? 880 : 660; // Alternating tones
                osc.connect(gainNode);
                osc.start();
                osc.stop(alarmAudioCtx.currentTime + 0.2);

                beepCount++;
                setTimeout(playBeep, 400);
            }

            playBeep();
        } catch (e) {
            console.log('Audio not supported:', e);
        }
    }

    /**
     * Stops the alarm sound.
     */
    function stopAlarmSound() {
        alarmPlaying = false;
        if (alarmAudioCtx) {
            try { alarmAudioCtx.close(); } catch (e) {}
            alarmAudioCtx = null;
        }
    }

    /**
     * Shows the alarm overlay for a high priority task.
     */
    function showAlarm(task, priority, reminderTime) {
        // Set alarm modal content
        $('#alarm-task-name').text(task);
        $('#alarm-time-text').html('<i class="bi bi-clock me-1"></i>Scheduled for: ' + reminderTime);

        var badge = $('#alarm-priority-badge');
        badge.text('🔴 ' + priority + ' Priority');
        badge.removeClass().addClass('badge alarm-priority-badge bg-danger');

        // Show the alarm overlay
        $('#alarm-overlay').fadeIn(300);

        // Play alarm sound
        playAlarmSound();

        // Also try to send browser notification
        sendBrowserNotification('⏰ HIGH PRIORITY ALARM!', task + ' - Scheduled for ' + reminderTime);
    }

    /**
     * Shows a reminder toast notification for medium/low priority tasks.
     */
    function showReminderToast(task, priority, reminderTime) {
        var isHigh = priority === 'High';
        var toastHtml = '<div class="reminder-toast ' + (isHigh ? 'toast-high' : '') + '">' +
            '<div class="toast-icon">' + (isHigh ? '🔴' : '🔔') + '</div>' +
            '<div class="toast-body">' +
            '<h6>Reminder: ' + priority + ' Priority</h6>' +
            '<p><strong>' + task + '</strong></p>' +
            '<p><i class="bi bi-clock me-1"></i>' + reminderTime + '</p>' +
            '</div>' +
            '<button class="toast-close" onclick="$(this).parent().fadeOut(300, function(){$(this).remove();})">&times;</button>' +
            '</div>';

        var toast = $(toastHtml).hide();
        $('#reminder-toast-container').prepend(toast);
        toast.fadeIn(400);

        // Auto-dismiss after 10 seconds
        setTimeout(function () {
            toast.fadeOut(500, function () { $(this).remove(); });
        }, 10000);

        // Send browser notification
        sendBrowserNotification('🔔 Task Reminder - ' + priority, task + ' - ' + reminderTime);
    }

    /**
     * Sends a browser notification (requires user permission).
     */
    function sendBrowserNotification(title, body) {
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(title, {
                body: body,
                icon: '📋',
                tag: 'planner-reminder'
            });
        }
    }

    // Request notification permission on page load
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
    }

    /**
     * Checks the API for active reminders and triggers alarms/toasts
     * when the current time matches the reminder time.
     */
    function checkReminders() {
        $.getJSON('/api/reminders', function (reminders) {
            var now = new Date();
            var currentHours = String(now.getHours()).padStart(2, '0');
            var currentMinutes = String(now.getMinutes()).padStart(2, '0');
            var currentTime = currentHours + ':' + currentMinutes;

            reminders.forEach(function (reminder) {
                var key = reminder.id + '-' + reminder.reminder_time;

                // Skip if already triggered
                if (triggeredReminders[key]) return;

                // Check if current time matches reminder time
                if (reminder.reminder_time === currentTime) {
                    triggeredReminders[key] = true;

                    if (reminder.priority === 'High') {
                        // HIGH PRIORITY → Full screen alarm with sound
                        showAlarm(reminder.task, reminder.priority, reminder.reminder_time);
                    } else {
                        // MEDIUM/LOW → Toast notification
                        showReminderToast(reminder.task, reminder.priority, reminder.reminder_time);
                    }
                }
            });
        }).fail(function () {
            // Silently fail if API is unavailable
        });
    }

    // Check reminders every 15 seconds
    setInterval(checkReminders, 15000);
    // Initial check after 2 seconds
    setTimeout(checkReminders, 2000);

    // Dismiss alarm button handler
    $('#alarm-dismiss-btn').on('click', function () {
        stopAlarmSound();
        $('#alarm-overlay').fadeOut(300);
    });

    // Also dismiss alarm on Escape key
    $(document).on('keydown', function (e) {
        if (e.key === 'Escape' && $('#alarm-overlay').is(':visible')) {
            stopAlarmSound();
            $('#alarm-overlay').fadeOut(300);
        }
    });

    // ============================================================
    // PRODUCTIVITY GAUGE - Animate the conic gradient
    // ============================================================
    $('.gauge-circle').each(function () {
        var score = $(this).data('score') || 0;
        $(this).css('--score', score);
    });

    // ============================================================
    // TOOLTIP INITIALIZATION
    // ============================================================
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[title]'));
    tooltipTriggerList.map(function (el) {
        return new bootstrap.Tooltip(el);
    });

    // ============================================================
    // KEYBOARD SHORTCUT: Ctrl+Shift+N to focus task input
    // ============================================================
    $(document).on('keydown', function (e) {
        if (e.ctrlKey && e.shiftKey && e.key === 'N') {
            e.preventDefault();
            $('#task-input').focus();
        }
    });

    console.log('✅ Smart Daily Planner v2.0 loaded!');
    console.log('🔔 Reminder system active - checking every 15 seconds');
});
