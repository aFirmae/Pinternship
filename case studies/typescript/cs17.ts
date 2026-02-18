// Abstract class: the blueprint for all content
abstract class Content {
	public readonly title: string;
	public readonly author: string;
	private published: boolean = false;

	constructor(title: string, author: string) {
		this.title = title;
		this.author = author;
	}

	public publish() {
		this.published = true;
	}

	protected isPublished(): boolean {
		return this.published;
	}

	// Every content type must say what type it is
	abstract getType(): string;
}

class Assignment extends Content {
	private dueDate: Date | null = null;

	constructor(title: string, author: string) {
		super(title, author);
	}

	public setDueDate(dueDate: Date, isInstructor: boolean): void {
		if (!isInstructor) {
			throw new Error("Only instructors can set the due date.");
		}
		if (this.isPublished()) {
			throw new Error("Cannot change due date after publishing.");
		}
		this.dueDate = dueDate;
	}

	public getDueDate(): Date | null {
		return this.dueDate;
	}

	public getType(): string {
		return "Assignment";
	}
}


const obj: Assignment = new Assignment("Digital Watermarking", "Nilashis Saha");
obj.setDueDate(new Date("2026-02-14"), true);

console.log(`Title: ${obj.title}`);
console.log(`Author: ${obj.author}`);
console.log(`Type: ${obj.getType()}`);
console.log(`Due Date: ${obj.getDueDate()}`);