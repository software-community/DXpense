const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Dxpense", function () {
  let Dxpense, dxpense, owner, alice, bob, charlie;

  beforeEach(async function () {
    [owner, alice, bob, charlie] = await ethers.getSigners();
    Dxpense = await ethers.getContractFactory("Dxpense");
    dxpense = await Dxpense.deploy();
  });

  it("should deploy and set the owner", async function () {
    expect(await dxpense.owner()).to.equal(owner.address);
  });

  it("should add a new trip and owner as person", async function () {
    await dxpense.connect(alice).AddTrip("Goa Trip", "Alice");
    const trip = await dxpense.connect(alice).getTrip(0); // 0 is the test trip from constructor
    expect(trip[1]).to.equal("Goa Trip");
    const [personAddr, personName] = await dxpense.getPerson(alice.address);
    expect(personName).to.equal("Alice");
    expect(personAddr).to.equal(alice.address);
  });

  it("should add a person to a trip", async function () {
    await dxpense.AddTrip("Goa Trip", "Alice");
    await dxpense.AddPerson(0, bob.address, "Bob");
    const trip = await dxpense.getTrip(0);
    expect(trip[2]).to.include(bob.address);
    const [personAddr, personName] = await dxpense.getPerson(bob.address);
    expect(personName).to.equal("Bob");
  });

  it("should not add the same person twice to a trip", async function () {
    await dxpense.AddTrip("Goa Trip", "Alice");
    await dxpense.AddPerson(0, bob.address, "Bob");
    await expect(
      dxpense.AddPerson(0, bob.address, "Bob")
    ).to.be.revertedWith("Person already in trip");
  });

  it("should add an expense and update expenseIds", async function () {
    await dxpense.AddTrip("Goa Trip", "Alice");
    await dxpense.AddPerson(0, bob.address, "Bob");
    await dxpense.AddExpense(
      0,
      1000,
      "Lunch",
      owner.address,
      [owner.address, bob.address]
    );
    const trip = await dxpense.getTrip(0);
    expect(trip[3].length).to.equal(1); // expenseIds array length
    const expenseId = trip[3][0];
    const expense = await dxpense.getExpense(expenseId);
    expect(expense[2]).to.equal("Lunch");
    expect(expense[1]).to.equal(1000);
  });

  it("should revert if someone other than the expender is adding the expense", async function () {
    await dxpense.connect(alice).AddTrip("Goa Trip", "Alice");
    await dxpense.connect(alice).AddPerson(0, bob.address, "Bob");
    await expect(
      dxpense.connect(alice).AddExpense(0, 1000, "Dinner", bob.address, [alice.address])
    ).to.be.revertedWith("Only the expender can add expense");
  });

  it("should revert if participant not in trip", async function () {
    await dxpense.AddTrip("Goa Trip", "Alice");
    await expect(
      dxpense.AddExpense(0, 1000, "Dinner", owner.address, [bob.address])
    ).to.be.revertedWith("Participant not in trip");
  });

  it("should calculate debts correctly", async function () {
    await dxpense.connect(alice).AddTrip("Goa Trip", "Alice");
    await dxpense.connect(alice).AddPerson(0, bob.address, "Bob");
    await dxpense.connect(alice).AddExpense(
      0,
      1000,
      "Lunch",
      alice.address,
      [alice.address, bob.address]
    );
    await dxpense.connect(alice).calculateDebts(0);
    const trip = await dxpense.connect(alice).getTrip(0);
    expect(trip[4].length).to.equal(1); // debtIds array length
    const debtId = trip[4][0];
    const debt = await dxpense.debts(debtId);
    expect(debt.amount).to.equal(500);
    expect(debt.debtor).to.equal(bob.address);
    expect(debt.creditor).to.equal(alice.address);
  });

  it("should settle a debt and recalculate debts", async function () {
    await dxpense.connect(alice).AddTrip("Goa Trip", "Alice");
    await dxpense.connect(alice).AddPerson(0, bob.address, "Bob");
    await dxpense.connect(alice).AddExpense(
      0,
      1000,
      "Lunch",
      alice.address,
      [alice.address, bob.address]
    );
    const trip = await dxpense.connect(alice).getTrip(0);
    const debtId = trip[4][0];
    await dxpense.connect(alice).settleDebt(0, debtId);
    const tripAfter = await dxpense.connect(alice).getTrip(0);
    expect(tripAfter[4].length).to.equal(0); // debtIds array should be empty
  });

  it("should return all trip IDs for a user", async function () {

    // Alice creates Goa Trip
    await dxpense.connect(alice).AddTrip("Goa Trip", "Alice");
    await dxpense.connect(alice).AddTrip("Amritsar Trip", "Alice");
    // Bob creates Manali Trip
    await dxpense.connect(bob).AddTrip("Manali Trip", "Bob");


    // For Alice
    const aliceTripIds = await dxpense.connect(alice).getUserTripIds();
    const aliceTrips = await Promise.all(
    aliceTripIds.map((id) => dxpense.connect(alice).getTrip(id))
    );
    const goaTrip = aliceTrips.find(trip => trip[1] === "Goa Trip");
    expect(goaTrip).to.not.be.undefined;
    expect(goaTrip[2]).to.include(alice.address);

    const amritsarTrip = aliceTrips.find(trip => trip[1] === "Amritsar Trip");
    expect(amritsarTrip).to.not.be.undefined;
    expect(amritsarTrip[2]).to.include(alice.address);

    // For Bob
    const bobTripIds = await dxpense.connect(bob).getUserTripIds();
    const bobTrips = await Promise.all(
    bobTripIds.map((id) => dxpense.connect(bob).getTrip(id))
    );
    const manaliTrip = bobTrips.find(trip => trip[1] === "Manali Trip");
    expect(manaliTrip).to.not.be.undefined;
    expect(manaliTrip[2]).to.include(bob.address);
  });
});