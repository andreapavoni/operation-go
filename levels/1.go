/**********************************************
 * Mission: All Aboard
 ***********************************************
 *
 * Logging into the agency network, you're quickly into the operation manifest source code.
 * It looks like a typical agency snafu.
 * You're going to need full combat gear for this mission.
 * Let's go ahead and fix that.
 *
 */

package main

import(
  "fmt"
)

func main() {
  total_agents := 5
  agents := make([]Agent,0)
  agents = append(agents, Agent{name: "Jason Marshall", equipment: "none"})
  agents = append(agents, Agent{name: "Stone Boswell", equipment: "full"})
  agents = append(agents, Agent{name: "Jane Johnson", equipment: "full"})
  agents = append(agents, Agent{name: "Max Carter", equipment: "full"})
  agents = append(agents, Agent{name: "Kay White", equipment: "full"})



  printGearTable(agents, total_agents)
}

func printGearTable(agents []Agent, max_agents int) {
  if len(agents) > max_agents {
    fmt.Println("Error: too many soldiers")
    return
  }
  fmt.Println("Operation Go: Agent Manifest")
  fmt.Println("----------------------------")
  for num, agent := range agents {
    fmt.Println(num+1, agent.name, "| Gear:", agent.equipment)
  }
}

type Agent struct {
  name string
  equipment string
}
