<script>
	const { ipcRenderer } = require('electron');
	const path = require('path');

	let directory;
	let files;
	let before;

	ipcRenderer.on('directory', (event, arg) => {
		directory = arg.directory;
		files = arg.files;
		before = path.normalize(path.join(directory, '..'));

		console.log(before);
	});
</script>

<main>
	{#if !directory}
		<div class="directory-selector">
			<button on:click={() => ipcRenderer.send('select')}>Select a directory</button>
		</div>
	{:else}
		<div class="file-browser">
			<div class="directory-url">{directory}</div>
			<ul class="directory-files">
				{#if before}
					<li>
						<a
							class="file"
							href="{before}"
							on:click|preventDefault={
								() => ipcRenderer.send('select', before)
							}
						>
							<span class="file-icon">←</span>
							<span class="file-name">..</span>
						</a>
					</li>
				{/if}
				{#each files as file}
					<li>
						{#if file.isDirectory}
							<a
								class="file"
								href="{file.addr}"
								on:click|preventDefault={
									() => ipcRenderer.send('select', file.addr)
								}
							>
								<span class="file-icon">🗀</span>
								<span class="file-name">{file.name}</span>
							</a>
						{:else}
							<span
								class="file"
							>
								<span class="file-icon">🗎</span>
								<span class="file-name">{file.name}</span>
							</span>
						{/if}
					</li>
				{/each}
			</ul>
		</div>
	{/if}
</main>

<style lang="scss">
	main {
		position: fixed;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
	}

	.directory-selector {
		position: fixed;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.file-browser {
		padding: 5px;
		display: flex;
		flex-direction: column;
		height: 100%;
	}

	.directory-url {
		flex-shrink: 0;
		border: 1px solid black;
		padding: 3px 8px;
		margin-bottom: 5px;
	}

	.directory-files {
		flex-shrink: 0;
		margin: 0;
		flex-grow: 1;
		padding: 5px;
		border: 1px solid black;
		display: flex;
		flex-wrap: wrap;
		list-style: none;
		align-content: flex-start;

		li {
			display: inline-flex;
			align-self: flex-start; 
		}
	}

	.file {
		padding: 3px 3px 1px;
		display: inline-flex;
		flex-direction: column;
		align-items: center;
		justify-content: flex-start;
		font-family: Helvetica, sans-serif;
		text-decoration: none;
		width: 55px;
		height: 55px;
		align-self: flex-start; 

		&-icon {
			font-size: 30px;
		}

		&-name {
			font-size: 10px;
			word-break: break-all;
			max-width: 55px;
			text-align: center;
			max-height: 20px;
			text-overflow: ellipsis;
			overflow: hidden;
		}
	}
</style>
