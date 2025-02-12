package main

import (
	"bufio"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"os"
	"strconv"
	"strings"
)

func main() {

	mesmer, err := os.Open("mesmer-spells.txt")
	if err != nil {
		fmt.Println(err)
	}

	level := -1

	var spells []Spell

	scanner := bufio.NewScanner(mesmer)
	// optionally, resize scanner's capacity for lines over 64K, see next example
	for scanner.Scan() {
		base := strings.Split(strings.Split(scanner.Text(), "  ")[0], "\t")[0]
		if !strings.Contains(base, "(") && !strings.Contains(base, ",") {

			if base == "" {
				continue
			}
			if val, err := strconv.Atoi(base[0:1]); err == nil {
				level = val
				continue
			}

			//fmt.Println(level)
			//fmt.Println(base)
			base = strings.TrimSpace(base)
			s := Spell{base, level, "mesmerist"}
			//fmt.Println(s)
			spells = append(spells, s)

		}
	}

	fmt.Println(spells)

	writeFile, _ := json.MarshalIndent(spells, "", " ")

	ioutil.WriteFile("mesmer-spells.json", writeFile, 0644)
}

type Spell struct {
	Name  string
	Level int
	Class string
}
