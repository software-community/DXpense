// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract Dxpense {
    string[] public names = ["Alice", "Bob", "Charlie"];
    int16 public random_number = 25;
    address public owner;

    struct Person {
        address person_id;
        string name;
    }
    struct Expense {
        uint256 expense_id;
        uint256 amount;
        uint256 trip_id;
        string name;
        address expender;
        address[] people_involved;
    }
    struct Debt {
        uint256 debt_id;
        address debtor;
        address creditor;
        uint256 amount;
    }
    struct Trip {
        uint256 trip_id;
        string name;
        address[] people; // store only addresses
        uint256[] expenseIds;
        uint256[] debtIds;
    }

    uint256 public trip_id_count = 0;
    uint256 public expense_id_count = 0;
    uint256 public debt_id_count = 0;

    mapping(uint256 => Trip) public trips;
    mapping(uint256 => Expense) public expenses;
    mapping(uint256 => Debt) public debts;
    mapping(address => Person) public people; // address => Person

    event TripCreated(uint256 indexed tripId, address indexed owner, string tripName);
    event PersonAdded(uint256 indexed tripId, address indexed person, string name);
    event ExpenseAdded(uint256 indexed tripId, uint256 indexed expenseId, address indexed expender, uint256 amount, string name);
    event DebtSettled(uint256 indexed tripId, uint256 indexed debtId, address debtor, address creditor, uint256 amount);

    constructor() {
        owner = msg.sender;
    }

    // Add a new trip
    function AddTrip(string calldata trip_name, string calldata owner_name) public {
        require(bytes(trip_name).length > 0, "Trip name required");
        require(bytes(owner_name).length > 0, "Owner name required");
        // Register the owner as a person if not already
        if (bytes(people[msg.sender].name).length == 0) {
            people[msg.sender] = Person(msg.sender, owner_name);
        }
        address[] memory temp_people = new address[](1);
        temp_people[0] = msg.sender;
        trips[trip_id_count] = Trip(trip_id_count, trip_name, temp_people, new uint256[](0), new uint256[](0));
        emit TripCreated(trip_id_count, msg.sender, trip_name);
        trip_id_count++;
    }

    // Add a person to a trip
    function AddPerson(uint256 trip_id, address p_address, string calldata p_name) public {
        require(trip_id < trip_id_count, "Trip does not exist");
        Trip storage trip = trips[trip_id];
        bool isInvolved = false;
        for (uint i = 0; i < trip.people.length; i++) {
            if (trip.people[i] == msg.sender) {
                isInvolved = true;
                break;
            }
        }
        require(isInvolved, "Only trip participants can add a person.");
        // Register the person if not already
        if (bytes(people[p_address].name).length == 0) {
            people[p_address] = Person(p_address, p_name);
        }
        // Add to trip if not already present
        address[] storage tripPeople = trips[trip_id].people;
        for (uint i = 0; i < tripPeople.length; i++) {
            if (tripPeople[i] == p_address) {
                revert("Person already in trip");
            }
        }
        tripPeople.push(p_address);
        emit PersonAdded(trip_id, p_address, p_name);
    }

    // Add an expense to a trip
    function AddExpense(
        uint256 trip_id,
        uint256 e_amount,
        string calldata e_name,
        address exp_addr,
        address[] calldata e_involved
    ) public {
        require(trip_id < trip_id_count, "Trip does not exist");
        require(e_involved.length > 0, "At least one participant required");
        require(msg.sender == exp_addr, "Only the expender can add expense");
        // Check expender is in trip
        bool expenderInTrip = false;
        for (uint i = 0; i < trips[trip_id].people.length; i++) {
            if (trips[trip_id].people[i] == exp_addr) {
                expenderInTrip = true;
                break;
            }
        }
        require(expenderInTrip, "Expender not in trip");
        // Check all involved are in trip
        for (uint i = 0; i < e_involved.length; i++) {
            bool found = false;
            for (uint j = 0; j < trips[trip_id].people.length; j++) {
                if (trips[trip_id].people[j] == e_involved[i]) {
                    found = true;
                    break;
                }
            }
            require(found, "Participant not in trip");
        }
        expenses[expense_id_count] = Expense(expense_id_count, e_amount, trip_id, e_name, exp_addr, e_involved);
        trips[trip_id].expenseIds.push(expense_id_count);
        expense_id_count++;
        emit ExpenseAdded(trip_id, expense_id_count - 1, exp_addr, e_amount, e_name);
        calculateDebts(trip_id);
    }

    // Get a trip's basic info
    function getTrip(uint256 trip_id) public view returns (
        uint256, string memory, address[] memory, uint256[] memory, uint256[] memory
    ) {
        require(trip_id < trip_id_count, "Trip does not exist");
        Trip storage trip = trips[trip_id];
        // Only allow if sender is in the trip
        bool inTrip = false;
        for (uint i = 0; i < trip.people.length; i++) {
            if (trip.people[i] == msg.sender) {
                inTrip = true;
                break;
            }
        }
        require(inTrip, "You are not involved in this trip");
        return (trip.trip_id, trip.name, trip.people, trip.expenseIds, trip.debtIds);
    }

    // Get all trip IDs the user is involved in
    function getUserTripIds() public view returns (uint256[] memory) {
        uint256 count = 0;
        for (uint256 i = 0; i < trip_id_count; i++) {
            Trip storage trip = trips[i];
            for (uint256 j = 0; j < trip.people.length; j++) {
                if (trip.people[j] == msg.sender) {
                    count++;
                    break;
                }
            }
        }
        uint256[] memory ids = new uint256[](count);
        uint256 idx = 0;
        for (uint256 i = 0; i < trip_id_count; i++) {
            Trip storage trip = trips[i];
            for (uint256 j = 0; j < trip.people.length; j++) {
                if (trip.people[j] == msg.sender) {
                    ids[idx] = trip.trip_id;
                    idx++;
                    break;
                }
            }
        }
        return ids;
    }

    // Get expense details by ID
    function getExpense(uint256 expense_id) public view returns (
        uint256, uint256, string memory, address, address[] memory
    ) {
        require(expense_id < expense_id_count, "Expense does not exist");
        Expense storage exp = expenses[expense_id];
        return (exp.expense_id, exp.amount, exp.name, exp.expender, exp.people_involved);
    }

    // Get person details by address
    function getPerson(address addr) public view returns (address, string memory) {
        Person storage p = people[addr];
        return (p.person_id, p.name);
    }

    function getDebt(uint256 debt_id) public view returns (
        uint256, address, address, uint256
    ) {
        require(debt_id < debt_id_count, "Debt does not exist");
        Debt storage d = debts[debt_id];
        return (d.debt_id, d.debtor, d.creditor, d.amount);
    }

    function calculateDebts(uint256 trip_id) public {
        require(trip_id < trip_id_count, "Trip does not exist");
        Trip storage trip = trips[trip_id];

        trip.debtIds = new uint256[](0);

        // Calculate new debts
        for (uint i = 0; i < trip.expenseIds.length; i++) {
            Expense storage expense = expenses[trip.expenseIds[i]];
            for (uint j = 0; j < expense.people_involved.length; j++) {
                address person = expense.people_involved[j];
                if (person == expense.expender) continue;
                uint256 amount = expense.amount / expense.people_involved.length;
                bool debtExists = false;
                for (uint k = 0; k < trip.debtIds.length; k++) {
                    Debt storage d = debts[trip.debtIds[k]];
                    if (d.debtor == person && d.creditor == expense.expender) {
                        d.amount += amount;
                        debtExists = true;
                        break;
                    } else if (d.debtor == expense.expender && d.creditor == person) {
                        if (d.amount > amount) {
                            d.amount -= amount;
                            debtExists = true;
                        } else if (d.amount < amount) {
                            d.debtor = person;
                            d.creditor = expense.expender;
                            d.amount = amount - d.amount;
                            debtExists = true;
                        } else {                            
                            debtExists = true;
                            // remove the debt from debtIds
                            for (uint l = 0; l < trip.debtIds.length; l++) {
                                if (trip.debtIds[l] == trip.debtIds[k]) {
                                    trip.debtIds[l] = trip.debtIds[trip.debtIds.length - 1];
                                    trip.debtIds.pop();
                                    break;
                                }
                            }
                        }
                        break;
                    }
                }
                if (debtExists) continue;
                debts[debt_id_count] = Debt(debt_id_count, person, expense.expender, amount);
                trip.debtIds.push(debt_id_count);
                debt_id_count++;
            }
        }
    }

    function settleDebt(uint256 trip_id, uint256 debt_id) public {
        require(trip_id < trip_id_count, "Trip does not exist");
        Trip storage trip = trips[trip_id];
        require(debt_id < debt_id_count, "Debt does not exist");
        require(debts[debt_id].debt_id == debt_id, "Debt does not exist");

        Debt storage temp_debt = debts[debt_id];
        require(temp_debt.amount > 0, "Debt already settled or does not exist");
        require(temp_debt.creditor == msg.sender, "Only creditor can settle debt");

        uint256 e_amount = temp_debt.amount;
        string memory e_name = "Debt Settlement";
        address temp_person = temp_debt.debtor;
        address[] memory temp_people_involved = new address[](1);
        temp_people_involved[0] = temp_debt.creditor;

        expenses[expense_id_count] = Expense(expense_id_count, e_amount, trip_id, e_name, temp_person, temp_people_involved);
        trip.expenseIds.push(expense_id_count);
        expense_id_count++;
        
        calculateDebts(trip_id);
        emit DebtSettled(trip_id, debt_id, temp_debt.debtor, temp_debt.creditor, e_amount);
    }

    // Add, calculate, and settle debts can be similarly refactored to use IDs and mappings

    // Test Functions
    function addName(string memory name) public {
        names.push(name);
    }

    function getNames() public view returns (string[] memory) {
        return names;
    }
}