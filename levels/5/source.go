// START OMIT
/**************************
 * Mission: Into the Open *
 **************************
 *
 *
 *
 */

package main

import(
  "fmt"
)

const FOUND_INTRUDER bool = true

func main() {
  camera := online()
  status := "Idle"
  if FOUND_INTRUDER == true {
    status = startRecording(camera)
  }

  // Something suspicious happened with the status code
  // so let's start recording
  if status != "Idle" && status != "Recording" {
    status = "Recording"
  }
  fmt.Println("Status:", status)
}

// EDITABLE OMIT

func online() RecordingDevice {
  return Camera{name: "Perimeter Camera"}
}

// UNEDITABLE OMIT

type RecordingDevice interface {
  record() string
}

type Camera struct {
  name string
}

func startRecording(device RecordingDevice) string {
  return device.record()
}

func (c Camera) record() string {
  if FOUND_INTRUDER {
    return "Recording"
  } else {
    return "Idle"
  }
}

// END OMIT
