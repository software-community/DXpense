// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract Dxpense {
    //Test Variables
    string[] public names = ["Alice", "Bob", "Charlie"];
    int16 public random_number = 25;
    address public owner;

    //Basic Variables and Definitions
    struct Person{
        address person_id;
        string name;
    }
    struct Expense{
        uint256 amount;
        uint256 trip_id;
        string name;
        Person expender;
        Person[] people_involved;
    }
    struct Trip{
        uint256 trip_id;
        string name;
        Person[] people;
        Expense[] expenses;
        string[] p_name_arr;
        address[] p_address_arr;
    }
    struct Debt{
        Person debtor;
        Person creditor;
        uint256 amount;
    }
    uint256 trip_id_count = 0;
    Trip[] allTrips;
    

    //Side variables used in some functions
    Person[] temp_people;
    Trip currentTrip;
    string[] temp_p_name_arr;
    address[] temp_p_address_arr;

    //Functions
    function AddTrip(string calldata trip_name, string calldata owner_name) public{ //This function creates a new trip
        Expense[] memory temp_expenses;
        temp_p_name_arr.push(owner_name);
        temp_p_address_arr.push(msg.sender);
        temp_people.push(Person(msg.sender, owner_name));
        allTrips.push(Trip(trip_id_count++, trip_name, temp_people, temp_expenses, temp_p_name_arr, temp_p_address_arr));
        delete temp_people;
    }

    function AddPerson(uint256 trip_id, address p_address, string calldata p_name) public{ //This function adds a person to a particular trip
        currentTrip = allTrips[trip_id];
        currentTrip.people.push(Person(p_address, p_name));
        currentTrip.p_name_arr.push(p_name);
        currentTrip.p_address_arr.push(p_address);
    }

    function getAddress(uint256 trip_id, string calldata name) private returns(address){ //This function finds the name in a trip and returns its address
        currentTrip = allTrips[trip_id];
        for(uint i=0; i<currentTrip.p_name_arr.length; i++){
            if(keccak256(bytes(currentTrip.p_name_arr[i])) == keccak256(bytes(name))){
                return currentTrip.p_address_arr[i];
            }
        }
        return 0x0000000000000000000000000000000000000000;
    }

    //This function assumes - name of expender is sent to the function & array of name of people involved is sent to the function
    function AddExpense(uint256 trip_id, uint256 e_amount, string calldata e_name, string calldata e_expender, string[] calldata e_involved) public{ //This function adds an expense to a particular trip
        currentTrip = allTrips[trip_id];
        Person memory temp_person = Person(getAddress(trip_id, e_expender), e_expender);
        for(uint i=0; i<e_involved.length; i++){
            temp_people.push(Person(getAddress(trip_id, e_involved[i]), e_involved[i]));
        }
        currentTrip.expenses.push(Expense(e_amount, trip_id, e_name, temp_person, temp_people));
        delete temp_people;
    }

    //Test Functions
    function addName(string memory name) public {
        names.push(name);
    }

    function getNames() public view returns (string[] memory) {
        return names;
    }
}